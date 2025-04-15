export default {
    site: {
        name: "tru-job",
        title: "React App",
        description: "A simple react app",
        author: "John Doe",
        keywords: "react, app",
        theme: {
            primaryColor: "#1890ff",
            secondaryColor: "#f0f2f5",
            textColor: "#000000",
            backgroundColor: "#ffffff"
        },
        menu: {
            types: {
                auth: {
                    authenticated: ['account', "logout"],
                    unauthenticated: ['login', 'register']
                },
            },
        }
    }
}