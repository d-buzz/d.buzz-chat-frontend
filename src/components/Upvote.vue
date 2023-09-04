<template>
  <div class="appbg2 appfg2 p-2">
    <div>
      <button class="btn whitespace-pre" @click="action">Upvote</button>
      <div class="font-bold float-right">
        <div>{{(voteEstimate*value/100).toFixed(3)}}</div>
      </div>
    </div>
    <div class="flex flex-row gap-x-2">
      <input class="inline-block" type="range" min="1" v-model="value" max="100" step="1">
      <span class="font-bold fg70 percent">{{formatValue(value)}}</span>
    </div>
  </div>
</template>
<script setup>
function toDouble(nu,defa=0) {
	if(nu === undefined) return defa;
	if(typeof nu === 'number') return nu;
  if(typeof nu === 'object') return Number(nu.amount)/Math.pow(10,nu.precision);
  var r = nu.trim();
  var i = r.indexOf(' ');
  if(i == -1) return Number(r);
  return Number(r.substring(0, i));
}
async function voteValue() {
  try {
    var username = getManager().user;
    if(stlib.Utils.isGuest(username)) return 0;
    var client = stlib.Utils.getDhiveClient();
    var accounts = await client.database.getAccounts([username]);
    if(accounts && accounts.length > 0) {
      var account = accounts[0];
      var result0 = await client.call("database_api", "get_reward_funds", {});
      if(result0.funds && result0.funds.length > 0) {
         var funds = result0.funds[0];
         var median = await client.database.getCurrentMedianHistoryPrice();
         if(median) {
            var reward_balance = toDouble(funds.reward_balance);
            var recent_claims = toDouble(funds.recent_claims);
            var vesting_shares = toDouble(account.vesting_shares);
            var received_vesting_shares = toDouble(account.received_vesting_shares);
            var delegated_vesting_shares = toDouble(account.delegated_vesting_shares);
            var voting_power = toDouble(account.voting_power);
            var hbd_median_price = toDouble(median.base.amount);
  
            var total_vests = vesting_shares + received_vesting_shares - delegated_vesting_shares;
            var rshares = voting_power * total_vests * 2;
            var estimate = rshares / recent_claims * reward_balance * hbd_median_price;
            return estimate;
         }
      }
    }
  }
  catch(e) { console.log(e); }
  return 0;
}
function init() {
  try {
    var value = window.localStorage.getItem("#upvote");
    if(value) {
      value = Number(value);
      if(value >= 1 && value <= 100) return value;
    }
  }
  catch(e) { console.log(e); }
  return 100;
}
const voteEstimate = ref(0);
const value = ref(init());
function formatValue(v) {
  if(v < 10) return "  "+v+"%";
  if(v < 100) return " "+v+"%";
  return v+"%";
}
function action() {
  var v = value.value;
  try {
    window.localStorage.setItem("#upvote", ""+v);
  }
  catch(e) { console.log(e); }
}
init();
async function initVoteValue() {
  voteEstimate.value = await voteValue();
}
initVoteValue();
</script> 
<style scoped>
.percent {
  @apply inline-block text-center rounded; 
  min-width: 37px;
  background-color: var(--apphg2);
}
</style>
