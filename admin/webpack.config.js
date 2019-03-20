const path = require('path');

module.exports = {
    "mode": "development",
	"watch": true,
    "entry": "./assets/js/src/app.js",
    "output": {
        "path": __dirname + '/assets/js/dist',
        "filename": "bundle.js"
    },
    "devtool": "source-map",
    "module": {
        "rules": [
            {
                "test": /\.(js|jsx)$/,
                "exclude": /node_modules/,
                "use": {
                    "loader": "babel-loader",
                    "options": {
                        "presets": [
                            "env",
                            "react"
                        ]
                    }
                }
            }
        ]
    }
};