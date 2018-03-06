const json5 = require('json5')
const exec = require("child_process").exec;
const fs = require("fs");
const path = require('path')

const challengeName = `ut-da-spring97-ca1`;

function mapLanguageToExtention(lang){
  switch (lang) {
    case 'cpp':
      return 'cpp'      
    case 'java':
      return 'java'
    case 'python':
      return 'py'
    case 'python3':
      return 'py'
  }
}

// insert result of 
// `https://www.hackerrank.com/rest/contests/${challengeName}/judge_submissions/?offset=0&limit=1000`
// in input.json
all = json5.parse(fs.readFileSync(path.join('input.json')))

ids = [];

all.models.forEach(submission => {
  if (submission.status_code === 2) {
    ids.push(submission.id);
  }
});

// console.log(ids);

const submissionURL = `https://www.hackerrank.com/rest/contests/${challengeName}/submissions/`;

ids.forEach(id => {
  exec(
    `curl '${submissionURL}/${id}' -H 'if-none-match: W/"b3ffcbbaa5e905f45df34562be7aee1f"' -H 'accept-encoding: gzip, deflate, br' -H 'accept-language: en-US,en;q=0.9,fa-IR;q=0.8,fa;q=0.7' -H 'upgrade-insecure-requests: 1' -H 'user-agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.108 Safari/537.36' -H 'accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8' -H 'cache-control: max-age=0' -H 'authority: www.hackerrank.com' -H 'cookie: _biz_uid=6da13683d342443d8beabdd7718b03b0; optimizelyEndUserId=oeu1517657912498r0.8769847887121094; __utma=74197771.2056830907.1517657858.1517657858.1517657858.1; __utmc=74197771; __utmz=74197771.1509096343.17.4.utmcsr=google|utmccn=(organic)|utmcmd=organic|utmctr=(not%20provided); h_r=community_home; h_v=log_in; default_cdn_url=hrcdn.net; session_id=r1hvtdli-1517657915930; cdn_url=hrcdn.net; cdn_set=true; web_browser_id=b2cb28f7e81848a7e937623c126e3343; h_l=auth_page; _hp2_id.698647726=%7B%22userId%22%3A%220283019351705641%22%2C%22pageviewId%22%3A%223317120069667246%22%2C%22sessionId%22%3A%225870343526133042%22%2C%22identity%22%3Anull%2C%22trackerVersion%22%3A%223.0%22%7D; optimizelySegments=%7B%221709580323%22%3A%22false%22%2C%221717251348%22%3A%22gc%22%2C%221719390155%22%3A%22direct%22%2C%222308790558%22%3A%22none%22%7D; optimizelyBuckets=%7B%7D; _biz_nA=2; _biz_pendingA=%5B%5D; _bizo_bzid=c49498b2-7e2c-4f74-8e40-9ac98cebeee3; _bizo_cksm=92121892F0B37211; _bizo_np_stats=155%3D1458%2C; hackerrank_mixpanel_token=00126d12-af9b-4c59-bc52-eeb29c8ed432; userty.core.s.62789b=%7B%22p%22%3A%22f%22%7D; mp_mixpanel__c=17; mp_jobs_test__c=17; remember_hacker_token=BAhbCFsGaQOZXyBJIiIkMmEkMTAkVWN5dFJCUkJlNGJhNVNpRmtJNS5YZQY6BkVUSSIXMTUxNzY1ODM0OS4yMjEzMzkyBjsARg%3D%3D--d12becc000c4ce8a0111c6e727c994160a05d799; metrics_user_identifier=205f99-bab2a41b0663a99c74031e98468dca7d8ac1a84d; _hrank_session=5b6e52ca12418ce95da99cfff44af00f600f74c8b003d1084330b25146a9ceda4f458802902fbba061ac36729bbeb3c18c86985f44b66baa7d50149cedbc7798; react_var=false__trm6; react_var2=false__trm6; mp_bcb75af88bccc92724ac5fd79271e1ff_mixpanel=%7B%22distinct_id%22%3A%20%2200126d12-af9b-4c59-bc52-eeb29c8ed432%22%2C%22%24initial_referrer%22%3A%20%22https%3A%2F%2Fwww.hackerrank.com%2Fcontests%2Fut-ds-fall96-ca3%2Fchallenges%22%2C%22%24initial_referring_domain%22%3A%20%22www.hackerrank.com%22%7D; mp_86cf4681911d3ff600208fdc823c5ff5_mixpanel=%7B%22distinct_id%22%3A%20%221615b75997f20d-05b519022e82f4-3a75045d-100200-1615b7599806f0%22%2C%22%24initial_referrer%22%3A%20%22https%3A%2F%2Fwww.hackerrank.com%2Fcontests%2Fut-ds-fall96-ca3%2Fchallenges%22%2C%22%24initial_referring_domain%22%3A%20%22www.hackerrank.com%22%7D' --compressed`,
    (err, stdout, stderr) => {
      //    console.log('err: ', err)
      stdout = JSON.parse(stdout);
        // console.log(stdout.model);
      if (stdout.model.challenge_slug && stdout.model.hacker_username){
        filename = `./${challengeName}/${stdout.model.challenge_slug}/${
          stdout.model.hacker_username
        }.${mapLanguageToExtention(stdout.model.language)}`
        fs.writeFileSync(
          filename,
          stdout.model.code
        );
        console.log(filename)
      }
      //    console.log('stderr: ', stderr)
    }
  );
});
