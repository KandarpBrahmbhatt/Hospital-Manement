"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cluster_1 = __importDefault(require("cluster"));
const os_1 = __importDefault(require("os"));
// Get total number of CPU cores available on the system
const totalCPUs = os_1.default.cpus().length;
console.log("totalCPUs is : ", totalCPUs);
if (cluster_1.default.isPrimary) {
    console.log("cluster is primary running ");
    console.log(`master process ${process.pid}`);
    // Fork workers
    // CORRECTED: Changed loop bound from i <= totalCPUs to i < totalCPUs.
    // If totalCPUs is 4, i <= 4 runs 5 times (0, 1, 2, 3, 4), which forks 5 processes.
    // Changing to i < totalCPUs forks exactly 4 processes, matching the CPU cores.
    for (let i = 0; i < totalCPUs; i++) {
        cluster_1.default.fork(); // jetala cpu hase aetali var run thase.
    }
    // ADDED: Auto-restart handler. If a worker process exits/crashes, we fork a new one
    // to maintain the same number of active workers.
    cluster_1.default.on("exit", (worker, code, signal) => {
        console.log(`Worker process ${worker.process.pid} exited with code ${code} (signal: ${signal}). Spawning a new worker...`);
        cluster_1.default.fork();
    });
}
else {
    // Worker processes import and run the main Express application
    Promise.resolve().then(() => __importStar(require("../backend")));
}
