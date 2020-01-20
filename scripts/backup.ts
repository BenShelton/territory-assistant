import dotenv from 'dotenv'
import { exec } from 'child_process'

dotenv.config()

const { MONGODB_BACKUP_URI, MONGODB_URI } = process.env
const chosenURI = MONGODB_BACKUP_URI || MONGODB_URI
if (!chosenURI) throw new Error('No MONGODB_BACKUP_URI or MONGODB_URI set in .env')
const fileName = 'backup-' + new Date().toISOString()
const command = `mongodump --out="dump/${fileName}" --uri "${chosenURI}" --gzip --verbose`

console.log('\x1b[33m%s\x1b[0m', 'Generating backup...')
exec(command, (err, stdout) => {
  if (err) throw err
  console.log(stdout)
  console.log('\x1b[32m%s\x1b[0m', 'Successfully created backup, see the /dump directory\n')
})
