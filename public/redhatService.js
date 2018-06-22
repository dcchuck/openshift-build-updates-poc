let redhatSocketConnection;

// The websocket handshake is failing unless we navigate to our server first - will get to the bottom of it but for now we'll make an app
// that navigates to the page so the connection can be created

const temporaryApplication = new fin.desktop.Application({
    name: 'temporaryApplication',
    url: `https://${rootOrigin}`,
    uuid: 'temporaryApplicatoin',
    mainWindowOptions: {
        autoShow: true
    }
}, () => {
    console.log('Temporary Application Created')
    temporaryApplication.run(() => {
        redhatSocketConnection = new WebSocket(`wss://${rootOrigin}/oapi/v1/watch/namespaces/my-test/builds?access_token=${demoToken}`);

        function handleWebSocketMessage(message) {
            function createBuildAlert(appName) {
                const buildAlertDiv = document.getElementById('build-alert');
                buildAlertDiv.innerText = `New Build Available: ${appName}`;
            }
            const messageData = JSON.parse(message.data);
            const appName = messageData.object.metadata.labels.app;
            if (messageData.object.status.phase === "Complete" && messageData.type === "MODIFIED") {
                console.log(`New build complete - ${appName} New Version Available!`)
                createBuildAlert(appName);
            }
        }
        
        redhatSocketConnection.onmessage = handleWebSocketMessage;
    },
    (e) => console.log(`Error running Application: ${e}`))
}, (e) => {
    console.log(`Error creating Application: ${e}`);
})

async function main () {
    function removeAppFromRegisteredApps(uuid) {
        registeredApps.forEach((el, index) => {
            if (el.uuid === uuid) {
                registeredApps.splice(index, 1);
            }
        })
    }

    let x = 0;
    const registeredApps = [];
    const service = await fin.desktop.Service.register();
    function updateApps(x) {
        registeredApps.forEach(app => {
            service.dispatch(app, 'valueUpdated', x);
        }) 
    }
    service.onConnection((id) => {
        console.log(`New Connection From App: ${id.uuid}`);
        registeredApps.push(id);
        let appToRegister = fin.desktop.Application.wrap(id.uuid);
        appToRegister.addEventListener('closed', () => removeAppFromRegisteredApps(id.uuid));
        appToRegister.addEventListener('crashed', () => removeAppFromRegisteredApps(id.uuid));
    });
    
    service.register('getValue', (payload, id) => {
        console.log(`Value of x requested from ${id.uuid}`);
        return x;
    })
    service.register('increment', (payload, id) => {
        ++x;
		updateLastIncrementer(id.uuid);
        updateApps(x);
		return x;
    });
    service.register('incrementBy', (payload, id) => {
        x += payload.amount;
		updateLastIncrementer(id.uuid);
        updateApps(x);
		return x;
    });
}

main().then(() => console.log(`Service successfully registered`));