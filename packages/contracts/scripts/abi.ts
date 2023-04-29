import * as fs from 'fs'
import * as path from 'path'
import UNIREP_APP_ABI from '../artifacts/contracts/UnirepApp.sol/ZKComm.json'

fs.writeFileSync(
    path.join(__dirname, '../abi/ZKComm.json'),
    JSON.stringify(UNIREP_APP_ABI.abi)
)
