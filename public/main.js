/*
curl -k -H "Authorization: Bearer FAaphXrrb7Rgj0jR4eahQkH2l9ts9Wf8N5kJ39R15BA" -H 'Accept: application/json' https://129.146.147.219:8443/oapi/v1/watch/namespaces/my-test/builds

const webRequest = new xml


message.data

JSON.parse that message.data

status is on that object - we are looking for status "Complete"


*/

/**
 * This is a temporary function I'm creating to manually launch the service
 */

let redhatService;

async function createRedHatService() {
    const redhatServiceUUID = 'RedHatServiceUUID';

    const serviceApp = await fin.Application.create({
        name: 'RedHatServiceName',
        uuid: redhatServiceUUID,
        url: `${window.location.origin}/redhatService.html`,
        mainWindowOptions: {
            autoShow: true
        }
    });

    await serviceApp.run();
    redhatService = await fin.desktop.Service.connect({ uuid: redhatServiceUUID });
}

createRedHatService().then(() => {
    console.log('Service Created.')
})