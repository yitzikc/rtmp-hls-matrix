const Ansible = require('node-ansible');

export function  setRoutingOnNginx (routing: object) {
    let playbook = new Ansible.Playbook().playbook('ansible/set_routing');
    playbook.inventory("nginx-hls,");
    playbook.on('stdout', (data: any) => { console.log(data.toString()); });
    playbook.on('stderr', (data: any) => { console.log(data.toString()); });
    playbook.variables({
        streams_to_keys: JSON.stringify(routing)
    });
    let promise = playbook.exec();

    return promise;
}
