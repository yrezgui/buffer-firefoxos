# Buffer for Firefox OS


### How to setup the development environment

1. Install ```Firefox```
2. Install [Redirector](https://addons.mozilla.org/en-US/firefox/addon/redirector/) extension to simulate the [redirect feature](https://developer.mozilla.org/en-US/Apps/Build/Manifest#redirects) of Firefox OS apps
	1. Create a new rule
	2. ```Include pattern``` should be like that : http://www.fakedomain.com/oauth-callback/* (This URL must be the same as defined in your Buffer developer dashboard)
	3. ```Redirect to``` must be like that : [http://localhost:8000/www/index.html#/start$1](http://localhost:8000/www/index.html#/start$1)
3. Clone the backend (OAuth token exchange + CORS proxy for testing on desktop) : https://github.com/yrezgui/buffer-login-backend
4. Start the backend
5. Launch ```gulp``` in the root folder of the app
6. Start ```python -m SimpleHTTPServer``` in the root folder of the app
7. Go to this address [http://localhost:8000/www/](http://localhost:8000/www/)
