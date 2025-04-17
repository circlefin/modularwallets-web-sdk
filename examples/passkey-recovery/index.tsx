import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import { polygonAmoy } from 'viem/chains'
import { type Hex, createPublicClient } from 'viem'
import { english, generateMnemonic, mnemonicToAccount } from 'viem/accounts'
import {
  type P256Credential,
  type SmartAccount,
  WebAuthnAccount,
  createBundlerClient,
  toWebAuthnAccount,
} from 'viem/account-abstraction'
import {
  recoveryActions,
  toCircleSmartAccount,
  toModularTransport,
  toPasskeyTransport,
  toWebAuthnCredential,
  WebAuthnMode
} from '@circle-fin/modular-wallets-core'
import { validateMnemonic } from 'bip39'

const clientKey = import.meta.env.VITE_CLIENT_KEY as string
const clientUrl = import.meta.env.VITE_CLIENT_URL as string

// Create Circle transports
const passkeyTransport = toPasskeyTransport(clientUrl, clientKey)
const modularTransport = toModularTransport(`${clientUrl}/polygonAmoy`, clientKey)

// Create a public client
const client = createPublicClient({
  chain: polygonAmoy,
  transport: modularTransport,
})

// Create a bundler client extended with recovery actions
const bundlerClient = createBundlerClient({
  chain: polygonAmoy,
  transport: modularTransport,
}).extend(recoveryActions)

// Recovery states enum
enum RecoveryState {
  None = "None",                           // No recovery setup
  KeyGenerated = "KeyGenerated",           // Recovery key generated but not registered
  Registered = "Registered",               // Recovery address registered with smart account
  EnteringMnemonic = "EnteringMnemonic",   // User is entering recovery mnemonic
  CreatingPasskey = "CreatingPasskey",     // Creating new passkey during recovery
  Recovered = "Recovered"                  // Account has been recovered
}

// Storage keys
const STORAGE = {
  CREDENTIAL: 'credential',
  USERNAME: 'username',
  RECOVERY_ADDRESS: 'recoveryAddress',
  RECOVERY_STATE: 'recoveryState'
}

export const PasskeyRecoveryExample = () => {
  // Basic states
  const [status, setStatus] = React.useState("")
  
  // Account states
  const [account, setAccount] = React.useState<SmartAccount>()
  const [credential, setCredential] = React.useState<P256Credential | null>(() =>
    JSON.parse(localStorage.getItem(STORAGE.CREDENTIAL) || 'null')
  )
  const [username, setUsername] = React.useState<string | undefined>(() => 
    localStorage.getItem(STORAGE.USERNAME) || undefined
  )
  
  // Recovery states
  const [recoveryState, setRecoveryState] = React.useState<RecoveryState>(() => 
    (localStorage.getItem(STORAGE.RECOVERY_STATE) as RecoveryState) || RecoveryState.None
  )
  const [recoveryMnemonic, setRecoveryMnemonic] = React.useState("")
  const [recoveryAddress, setRecoveryAddress] = React.useState<Hex | undefined>(() =>
    localStorage.getItem(STORAGE.RECOVERY_ADDRESS) as Hex | undefined
  )
  const [newCredential, setNewCredential] = React.useState<P256Credential | null>(null)
  const [userEnteredMnemonic, setUserEnteredMnemonic] = React.useState("")

  // Update recovery state helper
  const updateRecoveryState = (state: RecoveryState) => {
    setRecoveryState(state)
    localStorage.setItem(STORAGE.RECOVERY_STATE, state)
  }

  // Initialize account when credential is available
  React.useEffect(() => {
    if (!credential) return
    
    toCircleSmartAccount({
      client,
      owner: toWebAuthnAccount({ credential }) as WebAuthnAccount,
      name: username,
    }).then(setAccount)
  }, [credential])

  // Register a passkey to initialize a Circle Smart Account
  const registerPasskey = async () => {
    try {
      const inputUsername = (document.getElementById('username') as HTMLInputElement).value
      
      setStatus("Registering passkey...")
      const credential = await toWebAuthnCredential({
        transport: passkeyTransport,
        mode: WebAuthnMode.Register,
        username: inputUsername,
      })

      localStorage.setItem(STORAGE.CREDENTIAL, JSON.stringify(credential))
      localStorage.setItem(STORAGE.USERNAME, inputUsername)
      setCredential(credential)
      setUsername(inputUsername)
      setStatus("Passkey registered")
    } catch (err: any) {
      console.error(`Error: ${err.message}`)
    }
  }
  
  // Login with an existing passkey to initialize a Circle Smart Account
  const loginWithPasskey = async () => {
    try {
      setStatus("Authenticating passkey...")
      const credential = await toWebAuthnCredential({
        transport: passkeyTransport,
        mode: WebAuthnMode.Login,
      })

      localStorage.setItem(STORAGE.CREDENTIAL, JSON.stringify(credential))
      setCredential(credential)
      setStatus("Authentication successful")
    } catch (err: any) {
      console.error(`Error: ${err.message}`)
    }
  }

  // STEP 1: Generate recovery mnemonic and EOA
  const generateRecovery = async () => {
    try {
      setStatus("Generating recovery key...")
      
      const mnemonic = generateMnemonic(english)
      const recoveryEoa = mnemonicToAccount(mnemonic)
      
      setRecoveryMnemonic(mnemonic)
      setRecoveryAddress(recoveryEoa.address)
      localStorage.setItem(STORAGE.RECOVERY_ADDRESS, recoveryEoa.address)
      updateRecoveryState(RecoveryState.KeyGenerated)
      
      setStatus("Recovery key generated - SAVE YOUR RECOVERY PHRASE")
    } catch (err: any) {
      console.error(`Error: ${err.message}`)
    }
  }

  // STEP 2: Register recovery address with smart account
  const registerRecovery = async () => {
    if (!account || !recoveryAddress) {
      return
    }

    try {
      setStatus("Registering recovery address...")
      
      // Register recovery address with smart account
      await bundlerClient.registerRecoveryAddress({
        account,
        recoveryAddress,
        paymaster: true,
      })
      
      updateRecoveryState(RecoveryState.Registered)
      setStatus("Recovery address registered successfully")
    } catch (err: any) {
      console.error(`Error: ${err.message}`)
    }
  }

  // STEP 3: Start recovery process (user lost their passkey)
  const startRecovery = () => {
    localStorage.removeItem(STORAGE.CREDENTIAL)
    setCredential(null)
    setAccount(undefined)
    updateRecoveryState(RecoveryState.EnteringMnemonic)
    setStatus("Enter your recovery phrase")
  }

  // STEP 4: Process the user's entered mnemonic and create new passkey
  const processRecoveryMnemonic = async () => {
    if (!userEnteredMnemonic) {
      return
    }

    try {
      setStatus("Validating recovery phrase...")
      
      if (!validateMnemonic(userEnteredMnemonic.trim())) {
        return
      }
      
      const id = new Date().getTime()
      const recoveryUsername = username ? `${username}-recovered-${id}` : `recovered-user-${id}`
      const newPasskeyCredential = await toWebAuthnCredential({
        transport: passkeyTransport,
        mode: WebAuthnMode.Register,
        username: recoveryUsername,
      })
      
      setNewCredential(newPasskeyCredential)
      updateRecoveryState(RecoveryState.CreatingPasskey)
      setStatus("New passkey created")
    } catch (err: any) {
      console.error(`Error: ${err.message}`)
    }
  }

  // STEP 5: Execute recovery with new credential
  const executeRecovery = async () => {
    if (!newCredential || !userEnteredMnemonic) {
      return
    }

    try {
      setStatus("Executing recovery...")
      
      // Create temporary account with recovery EOA
      const localAccount = mnemonicToAccount(userEnteredMnemonic.trim())
      const tempAccount = await toCircleSmartAccount({
        client,
        owner: localAccount,
      })
      
      // Execute recovery to add new passkey credential
      await bundlerClient.executeRecovery({
        account: tempAccount,
        credential: newCredential,
        paymaster: true,
      })
      
      // Use the new credential for the account
      localStorage.setItem(STORAGE.CREDENTIAL, JSON.stringify(newCredential))
      setCredential(newCredential)
      setNewCredential(null)
      updateRecoveryState(RecoveryState.Recovered)
      setUserEnteredMnemonic("")
      
      setStatus("Account recovered successfully")
    } catch (err: any) {
      console.error(`Error: ${err.message}`)
    }
  }

  // Reset application data
  const reset = () => {
    localStorage.removeItem(STORAGE.CREDENTIAL)
    localStorage.removeItem(STORAGE.USERNAME)
    localStorage.removeItem(STORAGE.RECOVERY_ADDRESS)
    localStorage.removeItem(STORAGE.RECOVERY_STATE)
    
    setCredential(null)
    setUsername(undefined)
    setRecoveryMnemonic("")
    setRecoveryAddress(undefined)
    setNewCredential(null)
    setUserEnteredMnemonic("")
    setAccount(undefined)
    updateRecoveryState(RecoveryState.None)
    setStatus("")
  }

  // RECOVERY MODE VIEW
  if (recoveryState === RecoveryState.EnteringMnemonic || recoveryState === RecoveryState.CreatingPasskey) {
    return (
      <div>
        <h1>Passkey Recovery Example</h1>
        {status && <div><strong>Status:</strong> {status}</div>}
        
        <h2>Recovery Mode</h2>
        
        {recoveryState === RecoveryState.EnteringMnemonic ? (
          <div>
            <p>Enter the recovery phrase you saved:</p>
            <p>Once validated, it will prompt you to create a new passkey.</p>
            <textarea 
              rows={3} 
              style={{ width: '100%', maxWidth: '500px' }}
              value={userEnteredMnemonic}
              onChange={(e) => setUserEnteredMnemonic(e.target.value)}
              placeholder="Enter your recovery phrase (12 words separated by spaces)"
            />
            <div style={{ marginTop: '10px' }}>
              <button onClick={processRecoveryMnemonic}>Verify & Continue</button>
            </div>
          </div>
        ) : (
          <div>
            <p>New passkey created. Ready to complete recovery.</p>
            <button onClick={executeRecovery}>Execute Recovery</button>
          </div>
        )}
        
        <div style={{ marginTop: '20px' }}>
          <button onClick={reset}>Reset</button>
        </div>
      </div>
    )
  }

  // INITIAL VIEW: No credential yet
  if (!credential) {
    return (
      <div>
        <h1>Passkey Recovery Example</h1>
        {status && <div><strong>Status:</strong> {status}</div>}
        
        <>
          <h2>Register or Login to get started</h2>
          <input id="username" name="username" placeholder="Username" />
          <div>
            <button onClick={registerPasskey}>Register</button>
            <button onClick={loginWithPasskey}>Login</button>
          </div>
        </>
    
        <div style={{ marginTop: '20px' }}>
          <button onClick={reset}>Reset</button>
        </div>
      </div>
    )
  }

  if (!account) return <p>Loading...</p>

  // MAIN VIEW: Account exists
  return (
    <div>
      <h1>Passkey Recovery Example</h1>
      {status && <div><strong>Status:</strong> {status}</div>}
      
      <h2>Account</h2>
      <p><strong>Address:</strong> {account?.address}</p>
      
      {recoveryState !== RecoveryState.Recovered ? (
        <>
          <h2>Recovery Management</h2>
          
          {recoveryState === RecoveryState.None ? (
            <div>
              <button onClick={generateRecovery}>Generate Recovery Key</button>
            </div>
          ) : (
            <div>
              {recoveryState === RecoveryState.KeyGenerated && (
                <div style={{ 
                  border: '2px solid orange', 
                  padding: '10px', 
                  margin: '10px 0',
                }}>
                  <p><strong>IMPORTANT:</strong> Save your recovery phrase in a secure location.</p>
                  <p><strong>Recovery Mnemonic:</strong> {recoveryMnemonic}</p>
                </div>
              )}              
              {recoveryState === RecoveryState.KeyGenerated ? (
                <div>
                  <button onClick={registerRecovery}>Register Recovery Key</button>
                </div>
              ) : (
                <div>
                  <p><strong>Recovery Status:</strong> Registered ✓</p>
                  <button onClick={startRecovery}>Log out to Simulate Recovery</button>
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        <div>
          <p><strong>Recovery Status:</strong> Account recovered successfully ✓</p>
          <p>Your account has been recovered with a new passkey.</p>
        </div>
      )}
      
      <div style={{ marginTop: '20px' }}>
        <button onClick={reset}>Reset</button>
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <PasskeyRecoveryExample />,
) 
