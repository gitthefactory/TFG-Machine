$( document ).ready(function() {
  $("#providers").fadeOut();
  setTimeout(() => {
      $("#providers").fadeIn(400);
      $(".loading").fadeOut(400);
    },1000);
});

function openGame(game) {
  console.log(game)
  $('#screen').html("<button type='button' class='btn-close' onclick='closeGame()'>X</button><video width=100% height=100% autoplay><source src='assets/videos/"+game+".mp4' type='video/mp4'>Your browser does not support the video tag.</video> ")
  $('#screen').fadeIn(500)
}

function closeGame() {
  $('#screen').fadeOut(500)
  $('#screen').html('')
}

function handleAll(){
  $(".loading").fadeIn(400);
  $("#screen").fadeOut();
  $("#providers").fadeOut();
  $("#slots").fadeOut();
  $("#live").fadeOut();
  $("#crash").fadeOut();
  $("#sportbook").fadeOut();
  $("#tatan").fadeOut();
  $("#ezugi").fadeOut();
  $("#evolution").fadeOut();
  $("#igrosoft").fadeOut();
  $("#netent").fadeOut();
  $("#redtiger").fadeOut();
  $("#showball").fadeOut();
  $("#greentube").fadeOut();
  $("#agt").fadeOut();
  $("#aviatrix").fadeOut();
  $("#pragmatic").fadeOut();
  $("#rubyplay").fadeOut();
  $("#dreamcatcherCashier").fadeOut();
  $("#betonnumbersCashier").fadeOut();
  $("#goldenballsCashier").fadeOut();
  setTimeout(() => {
    $("#providers").fadeIn()
    $(".loading").fadeOut(400);
  }, 500);
}

function handleSlots(){
  $(".loading").fadeIn(400);
  $("#screen").fadeOut();
  $("#providers").fadeOut();
  $("#slots").fadeOut();
  $("#live").fadeOut();
  $("#crash").fadeOut();
  $("#sportbook").fadeOut();
  $("#tatan").fadeOut();
  $("#ezugi").fadeOut();
  $("#evolution").fadeOut();
  $("#igrosoft").fadeOut();
  $("#netent").fadeOut();
  $("#redtiger").fadeOut();
  $("#showball").fadeOut();
  $("#greentube").fadeOut();
  $("#agt").fadeOut();
  $("#aviatrix").fadeOut();
  $("#pragmatic").fadeOut();
  $("#rubyplay").fadeOut();
  $("#dreamcatcherCashier").fadeOut();
  $("#betonnumbersCashier").fadeOut();
  $("#goldenballsCashier").fadeOut();
  setTimeout(() => {
    $("#slots").fadeIn()
    // $(".loading").fadeOut(400);
  }, 500);
}

function handleLive(){
  // $(".loading").fadeIn(400);
  $("#screen").fadeOut();
  $("#providers").fadeOut();
  $("#slots").fadeOut();
  $("#live").fadeOut();
  $("#crash").fadeOut();
  $("#sportbook").fadeOut();
  $("#tatan").fadeOut();
  $("#ezugi").fadeOut();
  $("#evolution").fadeOut();
  $("#igrosoft").fadeOut();
  $("#netent").fadeOut();
  $("#redtiger").fadeOut();
  $("#showball").fadeOut();
  $("#greentube").fadeOut();
  $("#agt").fadeOut();
  $("#aviatrix").fadeOut();
  $("#pragmatic").fadeOut();
  $("#rubyplay").fadeOut();
  $("#dreamcatcherCashier").fadeOut();
  $("#betonnumbersCashier").fadeOut();
  $("#goldenballsCashier").fadeOut();
  setTimeout(() => {
    $("#live").fadeIn()
    // $(".loading").fadeOut(400);
  }, 500);
}

function handleCrash(){
  // $(".loading").fadeIn(400);
  $("#screen").fadeOut();
  $("#providers").fadeOut();
  $("#slots").fadeOut();
  $("#live").fadeOut();
  $("#crash").fadeOut();
  $("#sportbook").fadeOut();
  $("#tatan").fadeOut();
  $("#ezugi").fadeOut();
  $("#evolution").fadeOut();
  $("#igrosoft").fadeOut();
  $("#netent").fadeOut();
  $("#redtiger").fadeOut();
  $("#showball").fadeOut();
  $("#greentube").fadeOut();
  $("#agt").fadeOut();
  $("#aviatrix").fadeOut();
  $("#pragmatic").fadeOut();
  $("#rubyplay").fadeOut();
  $("#dreamcatcherCashier").fadeOut();
  $("#betonnumbersCashier").fadeOut();
  $("#goldenballsCashier").fadeOut();
  setTimeout(() => {
    $("#crash").fadeIn()
    // $(".loading").fadeOut(400);
  }, 500);
}

function handleTatan(){
  // $(".loading").fadeIn(400);
  $("#screen").fadeOut();
  $("#providers").fadeOut();
  $("#slots").fadeOut();
  $("#live").fadeOut();
  $("#crash").fadeOut();
  $("#sportbook").fadeOut();
  $("#tatan").fadeOut();
  $("#ezugi").fadeOut();
  $("#evolution").fadeOut();
  $("#igrosoft").fadeOut();
  $("#netent").fadeOut();
  $("#redtiger").fadeOut();
  $("#showball").fadeOut();
  $("#greentube").fadeOut();
  $("#agt").fadeOut();
  $("#aviatrix").fadeOut();
  $("#pragmatic").fadeOut();
  $("#rubyplay").fadeOut();
  $("#dreamcatcherCashier").fadeOut();
  $("#betonnumbersCashier").fadeOut();
  $("#goldenballsCashier").fadeOut();
  setTimeout(() => {
    $("#tatan").fadeIn()
    // $(".loading").fadeOut(400);
  }, 500);
}

function handleEzugi(){
  // $(".loading").fadeIn(400);
  $("#screen").fadeOut();
  $("#providers").fadeOut();
  $("#slots").fadeOut();
  $("#live").fadeOut();
  $("#crash").fadeOut();
  $("#sportbook").fadeOut();
  $("#tatan").fadeOut();
  $("#ezugi").fadeOut();
  $("#evolution").fadeOut();
  $("#igrosoft").fadeOut();
  $("#netent").fadeOut();
  $("#redtiger").fadeOut();
  $("#showball").fadeOut();
  $("#greentube").fadeOut();
  $("#agt").fadeOut();
  $("#aviatrix").fadeOut();
  $("#pragmatic").fadeOut();
  $("#rubyplay").fadeOut();
  $("#dreamcatcherCashier").fadeOut();
  $("#betonnumbersCashier").fadeOut();
  $("#goldenballsCashier").fadeOut();
  setTimeout(() => {
    $("#ezugi").fadeIn()
    // $(".loading").fadeOut(400);
  }, 500);
}

function handleEvolution(){
  // $(".loading").fadeIn(400);
  $("#screen").fadeOut();
  $("#providers").fadeOut();
  $("#slots").fadeOut();
  $("#live").fadeOut();
  $("#crash").fadeOut();
  $("#sportbook").fadeOut();
  $("#tatan").fadeOut();
  $("#ezugi").fadeOut();
  $("#evolution").fadeOut();
  $("#igrosoft").fadeOut();
  $("#netent").fadeOut();
  $("#redtiger").fadeOut();
  $("#showball").fadeOut();
  $("#greentube").fadeOut();
  $("#agt").fadeOut();
  $("#aviatrix").fadeOut();
  $("#pragmatic").fadeOut();
  $("#rubyplay").fadeOut();
  $("#dreamcatcherCashier").fadeOut();
  $("#betonnumbersCashier").fadeOut();
  $("#goldenballsCashier").fadeOut();
  setTimeout(() => {
    $("#evolution").fadeIn()
    // $(".loading").fadeOut(400);
  }, 500);
}

function handleNetent(){
  // $(".loading").fadeIn(400);
  $("#screen").fadeOut();
  $("#providers").fadeOut();
  $("#slots").fadeOut();
  $("#live").fadeOut();
  $("#crash").fadeOut();
  $("#sportbook").fadeOut();
  $("#tatan").fadeOut();
  $("#ezugi").fadeOut();
  $("#evolution").fadeOut();
  $("#igrosoft").fadeOut();
  $("#netent").fadeOut();
  $("#redtiger").fadeOut();
  $("#showball").fadeOut();
  $("#greentube").fadeOut();
  $("#agt").fadeOut();
  $("#aviatrix").fadeOut();
  $("#pragmatic").fadeOut();
  $("#rubyplay").fadeOut();
  $("#dreamcatcherCashier").fadeOut();
  $("#betonnumbersCashier").fadeOut();
  $("#goldenballsCashier").fadeOut();
  setTimeout(() => {
    $("#netent").fadeIn()
    // $(".loading").fadeOut(400);
  }, 500);
}

function handleRedTiger(){
  // $(".loading").fadeIn(400);
  $("#screen").fadeOut();
  $("#providers").fadeOut();
  $("#slots").fadeOut();
  $("#live").fadeOut();
  $("#crash").fadeOut();
  $("#sportbook").fadeOut();
  $("#tatan").fadeOut();
  $("#ezugi").fadeOut();
  $("#evolution").fadeOut();
  $("#igrosoft").fadeOut();
  $("#netent").fadeOut();
  $("#redtiger").fadeOut();
  $("#showball").fadeOut();
  $("#greentube").fadeOut();
  $("#agt").fadeOut();
  $("#aviatrix").fadeOut();
  $("#pragmatic").fadeOut();
  $("#rubyplay").fadeOut();
  $("#dreamcatcherCashier").fadeOut();
  $("#betonnumbersCashier").fadeOut();
  $("#goldenballsCashier").fadeOut();
  setTimeout(() => {
    $("#redtiger").fadeIn()
    // $(".loading").fadeOut(400);
  }, 500);
}

function handleShowball(){
  // $(".loading").fadeIn(400);
  $("#screen").fadeOut();
  $("#providers").fadeOut();
  $("#slots").fadeOut();
  $("#live").fadeOut();
  $("#crash").fadeOut();
  $("#sportbook").fadeOut();
  $("#tatan").fadeOut();
  $("#ezugi").fadeOut();
  $("#evolution").fadeOut();
  $("#igrosoft").fadeOut();
  $("#netent").fadeOut();
  $("#redtiger").fadeOut();
  $("#showball").fadeOut();
  $("#greentube").fadeOut();
  $("#agt").fadeOut();
  $("#aviatrix").fadeOut();
  $("#pragmatic").fadeOut();
  $("#rubyplay").fadeOut();
  $("#dreamcatcherCashier").fadeOut();
  $("#betonnumbersCashier").fadeOut();
  $("#goldenballsCashier").fadeOut();
  setTimeout(() => {
    $("#showball").fadeIn()
    // $(".loading").fadeOut(400);
  }, 500);
}

function handleIgrosoft(){
  // $(".loading").fadeIn(400);
  $("#screen").fadeOut();
  $("#providers").fadeOut();
  $("#slots").fadeOut();
  $("#live").fadeOut();
  $("#crash").fadeOut();
  $("#sportbook").fadeOut();
  $("#tatan").fadeOut();
  $("#ezugi").fadeOut();
  $("#evolution").fadeOut();
  $("#igrosoft").fadeOut();
  $("#netent").fadeOut();
  $("#redtiger").fadeOut();
  $("#showball").fadeOut();
  $("#greentube").fadeOut();
  $("#agt").fadeOut();
  $("#aviatrix").fadeOut();
  $("#pragmatic").fadeOut();
  $("#rubyplay").fadeOut();
  $("#dreamcatcherCashier").fadeOut();
  $("#betonnumbersCashier").fadeOut();
  $("#goldenballsCashier").fadeOut();
  setTimeout(() => {
    $("#igrosoft").fadeIn()
    // $(".loading").fadeOut(400);
  }, 500);
}

function handleGreentube(){
  // $(".loading").fadeIn(400);
  $("#screen").fadeOut();
  $("#providers").fadeOut();
  $("#slots").fadeOut();
  $("#live").fadeOut();
  $("#crash").fadeOut();
  $("#sportbook").fadeOut();
  $("#tatan").fadeOut();
  $("#ezugi").fadeOut();
  $("#evolution").fadeOut();
  $("#igrosoft").fadeOut();
  $("#netent").fadeOut();
  $("#redtiger").fadeOut();
  $("#showball").fadeOut();
  $("#greentube").fadeOut();
  $("#agt").fadeOut();
  $("#aviatrix").fadeOut();
  $("#pragmatic").fadeOut();
  $("#rubyplay").fadeOut();
  $("#dreamcatcherCashier").fadeOut();
  $("#betonnumbersCashier").fadeOut();
  $("#goldenballsCashier").fadeOut();
  setTimeout(() => {
    $("#greentube").fadeIn()
    // $(".loading").fadeOut(400);
  }, 500);
}

function handleRubyplay(){
  // $(".loading").fadeIn(400);
  $("#screen").fadeOut();
  $("#providers").fadeOut();
  $("#slots").fadeOut();
  $("#live").fadeOut();
  $("#crash").fadeOut();
  $("#sportbook").fadeOut();
  $("#tatan").fadeOut();
  $("#ezugi").fadeOut();
  $("#evolution").fadeOut();
  $("#igrosoft").fadeOut();
  $("#netent").fadeOut();
  $("#redtiger").fadeOut();
  $("#showball").fadeOut();
  $("#greentube").fadeOut();
  $("#agt").fadeOut();
  $("#aviatrix").fadeOut();
  $("#pragmatic").fadeOut();
  $("#rubyplay").fadeOut();
  $("#dreamcatcherCashier").fadeOut();
  $("#betonnumbersCashier").fadeOut();
  $("#goldenballsCashier").fadeOut();
  setTimeout(() => {
    $("#rubyplay").fadeIn()
    // $(".loading").fadeOut(400);
  }, 500);
}

function handleAviatrix(){
  // $(".loading").fadeIn(400);
  $("#screen").fadeOut();
  $("#providers").fadeOut();
  $("#slots").fadeOut();
  $("#live").fadeOut();
  $("#crash").fadeOut();
  $("#sportbook").fadeOut();
  $("#tatan").fadeOut();
  $("#ezugi").fadeOut();
  $("#evolution").fadeOut();
  $("#igrosoft").fadeOut();
  $("#netent").fadeOut();
  $("#redtiger").fadeOut();
  $("#showball").fadeOut();
  $("#greentube").fadeOut();
  $("#agt").fadeOut();
  $("#aviatrix").fadeOut();
  $("#pragmatic").fadeOut();
  $("#rubyplay").fadeOut();
  $("#dreamcatcherCashier").fadeOut();
  $("#betonnumbersCashier").fadeOut();
  $("#goldenballsCashier").fadeOut();
  setTimeout(() => {
    $("#aviatrix").fadeIn()
    // $(".loading").fadeOut(400);
  }, 500);
}

function handleDreamCatcher(){
  // $(".loading").fadeIn(400);
  $("#screen").fadeOut();
  $("#providers").fadeOut();
  $("#slots").fadeOut();
  $("#live").fadeOut();
  $("#crash").fadeOut();
  $("#sportbook").fadeOut();
  $("#tatan").fadeOut();
  $("#ezugi").fadeOut();
  $("#evolution").fadeOut();
  $("#igrosoft").fadeOut();
  $("#netent").fadeOut();
  $("#redtiger").fadeOut();
  $("#showball").fadeOut();
  $("#greentube").fadeOut();
  $("#agt").fadeOut();
  $("#aviatrix").fadeOut();
  $("#pragmatic").fadeOut();
  $("#rubyplay").fadeOut();
  $("#dreamcatcherCashier").fadeOut();
  $("#betonnumbersCashier").fadeOut();
  $("#goldenballsCashier").fadeOut();
  setTimeout(() => {
    $("#dreamcatcherCashier").fadeIn()
    // $(".loading").fadeOut(400);
  }, 500);
}

function handleBetOnNumbers(){
  // $(".loading").fadeIn(400);
  $("#screen").fadeOut();
  $("#providers").fadeOut();
  $("#slots").fadeOut();
  $("#live").fadeOut();
  $("#crash").fadeOut();
  $("#sportbook").fadeOut();
  $("#tatan").fadeOut();
  $("#ezugi").fadeOut();
  $("#evolution").fadeOut();
  $("#igrosoft").fadeOut();
  $("#netent").fadeOut();
  $("#redtiger").fadeOut();
  $("#showball").fadeOut();
  $("#greentube").fadeOut();
  $("#agt").fadeOut();
  $("#aviatrix").fadeOut();
  $("#pragmatic").fadeOut();
  $("#rubyplay").fadeOut();
  $("#dreamcatcherCashier").fadeOut();
  $("#betonnumbersCashier").fadeOut();
  $("#goldenballsCashier").fadeOut();
  setTimeout(() => {
    $("#betonnumbersCashier").fadeIn()
    // $(".loading").fadeOut(400);
  }, 500);
}

function handleGoldenBalls(){
  // $(".loading").fadeIn(400);
  $("#screen").fadeOut();
  $("#providers").fadeOut();
  $("#slots").fadeOut();
  $("#live").fadeOut();
  $("#crash").fadeOut();
  $("#sportbook").fadeOut();
  $("#tatan").fadeOut();
  $("#ezugi").fadeOut();
  $("#evolution").fadeOut();
  $("#igrosoft").fadeOut();
  $("#netent").fadeOut();
  $("#redtiger").fadeOut();
  $("#showball").fadeOut();
  $("#greentube").fadeOut();
  $("#agt").fadeOut();
  $("#aviatrix").fadeOut();
  $("#pragmatic").fadeOut();
  $("#rubyplay").fadeOut();
  $("#dreamcatcherCashier").fadeOut();
  $("#betonnumbersCashier").fadeOut();
  $("#goldenballsCashier").fadeOut();
  setTimeout(() => {
    $("#goldenballsCashier").fadeIn()
    // $(".loading").fadeOut(400);
  }, 500);
}