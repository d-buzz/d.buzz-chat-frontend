<script setup>
import Gun from "gun";
const gun = Gun({
  peers: ["http://localhost:3030/gun"],
});

function saveMessage() {
  console.log(this.name);

  // const messages = gun.get("messages");
  // messages.set({
  //   formName,
  //   formMessage,
  //   createdAt: Date.now(),
  // });
  // this.form = {
  //   name: "",
  //   message: "",
  // };
}

const initialState = {
  messages: [],
};
data: () => {
  return {
    formName,
    formMessage,
    state: initialState,
  };
};
methods: {
  function saveMessage() {
    console.log(this.name);
    // const messages = gun.get("messages");
    // messages.set({
    //   name: formState.name,
    //   message: formState.message,
    //   createdAt: Date.now(),
    // });
    // setForm({
    //   name: "",
    //   message: "",
    // });
  }
}
created: () => {
  const messages = gun.get("messages");
  messages.map().once((m) => {
    this.state = {
      messages: [
        {
          name: m.name,
          message: m.message,
          createdAt: m.createdAt,
        },
        ...this.state.messages,
      ],
    };
  });
};
</script>

<template>
  <header>
    <div class="padding30">
      <input name="name" @change="console.log(e.target.value)" />
      <input name="message" type="text" v-model="formMessage" />
      <button @click="saveMessage">Send Message</button>
      <div v-for="message in messages">
        <div>
          <h2>{{ message.message }}</h2>
          <h3>From: {{ message.name }}</h3>
          <p>Date: {{ message.createdAt }}</p>
        </div>
      </div>
    </div>
  </header>

  <main></main>
</template>

<style>
.padding30 {
  padding: 30;
}
</style>
