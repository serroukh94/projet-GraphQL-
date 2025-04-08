import { createApp, h, provide } from 'vue'
import App from './App.vue'
import router from './router'         // On importe notre router
import apolloClient from './apollo/apolloClient'
import { DefaultApolloClient } from '@vue/apollo-composable'

const app = createApp({
  setup() {
    // On fournit Apollo Client à l'application
    provide(DefaultApolloClient, apolloClient)
  },
  render: () => h(App)
})

// On utilise le router pour la navigation
app.use(router)

// On monte l'application sur la div #app (index.html)
app.mount('#app')
