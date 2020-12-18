<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="8">
      <div class="text-center">
        <logo />
        <h1>API Test</h1>
      </div>
      <v-card class="mx-auto">
        <v-card-title class="headline">
          <v-file-input
          v-model="file"
            show-size
            dense
            label="File for send"
            truncate-length="25"
          ></v-file-input>
           <v-spacer />
          {{ action }} 
        </v-card-title>
        <v-card-subtitle>
        Backend answer
        </v-card-subtitle>
        <v-card-text>
          {{ answer }}
        </v-card-text>
        <v-card-actions >
          <v-list >
            <v-list-item-group
              v-model="model"
              active-class="border"
              color="indigo"
            >
            <v-list-item
              v-for="(item, index) in tests"
              :key="index"
              @click="onButton(index)"
            >
            <v-list-item-icon>
              <v-icon v-text="item.icon"></v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="item.title"></v-list-item-title>
            </v-list-item-content>            

            </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import Logo from '~/components/Logo.vue'
import VuetifyLogo from '~/components/VuetifyLogo.vue'

export default {
  components: {
    Logo,
    VuetifyLogo
  },
  data: () =>({
    model: 0,
    file: null,
    answer: 'NO ANSWER',
    action:'NO ACTION',
    tests: [
      {
        title: 'Get JSON',
        icon:'mdi-wifi',
      },
      {
        title: 'Upload file atomicaty',
        icon:'mdi-bluetooth',
      },
      {
        title: 'Upload file via streem',
        icon:'mdi-chart-donut',
      },
    ]
  }),
  watch: {
    model (id) {
      this.onButton( id )
    },
  },  
  methods: {
    async onButton ( id ) {
      const f = [
        this.test1,
        this.test2,
        this.test3,
      ]
      this.action = this.tests[id].title
      const test = f[id] || null
      if (test) {
        this.answer = await test( id )
      }
    },
    async test1( id ){
        return await this.$axios.$get('/');
    },
    async test2( id ){
        return await this.$axios.$get('/example');
    },
    async test3( id ){
        if (this.file) {
            const res = await this.$axios.$get('/test');
            return res;
        }
    },

  }

}
</script>
