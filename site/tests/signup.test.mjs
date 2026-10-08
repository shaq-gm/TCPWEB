import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFile } from 'node:fs/promises';
const code = await readFile(new URL('../dist/signup.js',import.meta.url),'utf8');
function fixture(fetcher) {
  const handlers = {};
  const email = {value:'tester@example.com',validity:{valid:true}, attributes:{}, setAttribute(k,v){this.attributes[k]=v;}, removeAttribute(k){delete this.attributes[k];}, focus(){this.focused=true;}, addEventListener(type,fn){handlers[type]=fn;}};
  const button = {disabled:false}; const message={textContent:'',dataset:{}};
  const form={elements:{email,website:{value:''}}, querySelector(){return button;}, addEventListener(type,fn){handlers[type]=fn;},setAttribute(){},removeAttribute(){}};
  vm.runInNewContext(code,{document:{querySelector(s){return s==='.signup'?form:message;}},fetch:fetcher,AbortController,setTimeout,clearTimeout});
  return {email,button,message,submit:()=>handlers.submit({preventDefault(){}}),input:()=>handlers.input()};
}
for (const [status,text] of [['accepted','Thanks—you’re on the list.'],['confirmation_required','Check your inbox'],['already_subscribed','Thanks—you’re on the list.'],['validating','signup is being checked'],['rate_limited','Too many attempts'],['error','We couldn’t sign you up'],['unavailable','Signup is not available yet']]) {
  test(`browser feedback for ${status}`,async()=>{
    const f=fixture(async()=>Response.json({status},{status:['rate_limited','error','unavailable'].includes(status)?503:200}));
    await f.submit(); assert.ok(f.message.textContent.includes(text)); assert.equal(f.button.disabled,false); assert.equal(f.email.value,'tester@example.com');
  });
}
test('invalid email focuses field, associates error, and prevents network request',async()=>{
  let calls=0; const f=fixture(async()=>{calls++;}); f.email.value='invalid'; await f.submit();
  assert.equal(calls,0); assert.equal(f.email.attributes['aria-invalid'],'true'); assert.equal(f.email.focused,true);
  f.input(); assert.equal(f.email.attributes['aria-invalid'],undefined);
});
test('loading prevents repeated submission and retains address on failure for retry',async()=>{
  let calls=0, complete;
  const f=fixture(()=>{calls++;return new Promise(resolve=>{complete=resolve;});});
  const pending=f.submit(); assert.equal(f.message.textContent,'Signing you up…'); assert.equal(f.button.disabled,true);
  await f.submit(); assert.equal(calls,1);
  complete(Response.json({status:'error'},{status:502})); await pending;
  assert.equal(f.email.value,'tester@example.com'); assert.equal(f.email.readOnly,false);
  const retry=f.submit(); assert.equal(calls,2); complete(Response.json({status:'accepted'})); await retry;
});
test('test mode never presents a mock signup as real',async()=>{
  const f=fixture(async()=>Response.json({status:'accepted',test:true})); await f.submit();
  assert.ok(f.message.textContent.startsWith('Local test only—no subscription was created.'));
});
test('network and response decoding failures show retry feedback',async()=>{
  for(const fetcher of [async()=>{throw Error('offline');},async()=>new Response('not json')]){
    const f=fixture(fetcher); await f.submit(); assert.equal(f.message.dataset.state,'error'); assert.equal(f.button.disabled,false);
  }
});
