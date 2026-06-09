import cluster from "cluster"
import os from 'os'

// Get total number of CPU cores available on the system
const totalCPUs = os.cpus().length
console.log("totalCPUs is : ", totalCPUs)

if (cluster.isPrimary) {
    console.log("cluster is primary running ")
    console.log(`master process ${process.pid}`)

    // Fork workers
    // CORRECTED: Changed loop bound from i <= totalCPUs to i < totalCPUs.
    // If totalCPUs is 4, i <= 4 runs 5 times (0, 1, 2, 3, 4), which forks 5 processes.
    // Changing to i < totalCPUs forks exactly 4 processes, matching the CPU cores.
    for(let i=0;i<totalCPUs;i++){
        cluster.fork()  // jetala cpu hase aetali var run thase.
    }

    // ADDED: Auto-restart handler. If a worker process exits/crashes, we fork a new one
    // to maintain the same number of active workers.
    cluster.on("exit", (worker, code, signal) => {
        console.log(`Worker process ${worker.process.pid} exited with code ${code} (signal: ${signal}). Spawning a new worker...`);
        cluster.fork();
    });
}
else{
    // Worker processes import and run the main Express application
    import ("../backend")
}


