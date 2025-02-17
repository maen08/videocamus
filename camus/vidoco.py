from logging.config import dictConfig
# import util 


# LoopTimer = util.LoopTimer
# ping_clients = util.ping_clients
# reap_clients = util.reap_clients
# reap_rooms = util.reap_rooms


dictConfig({
    'version': 1,
    'formatters': {'default': {
        #'format': '[%(asctime)s] %(levelname)s in %(module)s: %(message)s',
        'format': '[%(levelname)s] in %(module)s %(funcName)s %(lineno)d: %(message)s',
    }},
    'handlers': {'wsgi': {
        'class': 'logging.StreamHandler',
        'formatter': 'default'
    }},
    'root': {
        'level': 'INFO',
        'handlers': ['wsgi']
    }
})

import quart.flask_patch

from quart import Quart
from flask_bootstrap import Bootstrap
# from flask_sqlalchemy import SQLAlchemy

# from .config import Config
import config
import custom_db

bootstrap = Bootstrap()
# db = SQLAlchemy()
db = custom_db.db

# from camus.message_handler import MessageHandler
import message_handler
message_handler = message_handler.MessageHandler()

def create_app(config_class=config.Config):
    app = Quart(__name__)
    app.config.from_object(config_class)

    # Initialize extensions
    bootstrap.init_app(app)
    db.init_app(app)
    db.create_all(app=app)

    # Apply blueprint for our routes
    # from camus import routes
    import routes
    app.register_blueprint(routes.bp)

    # Start background tasks before serving
    @app.before_serving
    async def startup():
        import util
        # from camus.util import LoopTimer, ping_clients, reap_clients, reap_rooms
        message_handler.start()
        util.LoopTimer(20, util.ping_clients, message_handler=message_handler)
        util.LoopTimer(30, util.reap_clients, message_handler=message_handler)
        util.LoopTimer(300, util.reap_rooms)

    return app


app = create_app()