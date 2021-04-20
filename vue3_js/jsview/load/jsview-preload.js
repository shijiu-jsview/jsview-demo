import { loadJsViewEnv } from 'jsview/load/loader'

loadJsViewEnv(() => {
    import('/src/main.js');
})
