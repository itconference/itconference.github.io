const { readFileSync, writeFileSync } = require('fs');
const { renderFile } = require('pug');
const { resolve } = require('path');
const { load } = require('js-yaml');
const encoding = 'utf-8'
const dayjs = require('dayjs');
const rimraf = require('rimraf');
const conferencesYaml = resolve(__dirname, '../conferences.yaml');
const { conferences } = load(readFileSync(conferencesYaml, { encoding }));

const confs = conferences
  .filter(({tags}) => tags.includes('Full-stack'))
  .filter(({scheduled}) => !!scheduled)

const html = renderFile(resolve(__dirname, './github.pug'), {
  conferences: confs,
  year: dayjs().year()
});  

const { GH_UNI_USER, GH_UNI_PW } = process.env
const REPO = 'the-best-developer-conferences';
const remote = `https://${GH_UNI_USER}:${GH_UNI_PW}@github.com/unicorncoding/${REPO}`;
const local = `cloned/${REPO}`;

rimraf.sync(local);
process.on('unhandledRejection', up => { throw up })
require('simple-git')()
  .silent(true)
  .clone(remote, local)
  .then(() => updateAndPushReadme(html, local))


function updateAndPushReadme(body, repo) {
  writeFileSync(`${repo}/README.md`, body);
  return new Promise((resolve, reject) => {
    require('simple-git')(repo)
    .silent(true)
    .addConfig('user.name', 'unicorncoding')
    .addConfig('user.email', 'co.unicorn.ding@gmail.com')    
    .commit(`update conference list ${dayjs()}`, 'README.md')
    .push('origin', 'master', (err, ok) => {
      if (err) {
        reject(err)
      } else {
        resolve(ok)
      }
    });    
  })
}