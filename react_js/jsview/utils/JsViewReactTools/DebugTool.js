

// 用于存储用于Debug的全局引用
let DebugObjectRefer = {
    RootRouter: null,
};

let DebugTools = {
    // 打印当前活跃的FDiv元素
    printFocusNodes: ()=>{
        DebugObjectRefer.RootRouter.printNodes();
    },
};

// 全局引用，以便于在devtools中能直接进行查询
window.JsvDebugTools = DebugTools;

export {
    DebugTools,
    DebugObjectRefer,
}