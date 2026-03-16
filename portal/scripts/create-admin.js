/**
 * create-admin.js — Create or update an admin user for the Burlington Cadets CMS
 *
 * Usage:
 *   node scripts/create-admin.js
 */

const readline = require('readline');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const USERS_FILE = path.join(__dirname, '../data/users.json');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(question) {
  return new Promise(resolve => rl.question(question, resolve));
}

async function main() {
  console.log('\n  Burlington Cadets CMS — Create Admin User\n');

  const username = (await ask('  Enter username: ')).trim();
  if (!username) {
    console.error('  Username cannot be empty.');
    process.exit(1);
  }

  const password = (await ask('  Enter password: ')).trim();
  if (password.length < 8) {
    console.error('  Password must be at least 8 characters.');
    process.exit(1);
  }

  const confirm = (await ask('  Confirm password: ')).trim();
  if (password !== confirm) {
    console.error('  Passwords do not match.');
    process.exit(1);
  }

  rl.close();

  const saltRounds = 12;
  console.log('\n  Hashing password…');
  const passwordHash = await bcrypt.hash(password, saltRounds);

  let data = { _note: 'Run node scripts/create-admin.js to create credentials.', users: [] };
  if (fs.existsSync(USERS_FILE)) {
    data = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
    if (!Array.isArray(data.users)) data.users = [];
  }

  const existingIndex = data.users.findIndex(u => u.username === username);
  if (existingIndex >= 0) {
    data.users[existingIndex].passwordHash = passwordHash;
    console.log(`  Updated password for existing user: ${username}`);
  } else {
    data.users.push({ username, passwordHash });
    console.log(`  Created admin user: ${username}`);
  }

  fs.writeFileSync(USERS_FILE, JSON.stringify(data, null, 2), 'utf8');
  console.log('  Saved to data/users.json\n');
  console.log('  You can now run:  npm start');
  console.log('  Then visit:       http://localhost:3000/admin\n');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
