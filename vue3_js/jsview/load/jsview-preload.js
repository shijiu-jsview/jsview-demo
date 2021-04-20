import { loadJsviewEnv } from 'jsview/load/loader'

loadJsviewEnv(() => {
    import('/src/main.js');
})
