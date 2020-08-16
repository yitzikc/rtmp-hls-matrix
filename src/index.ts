import { createServer, Request, Response, plugins } from 'restify';
import { setRoutingOnNginx } from './routing-control';

const setRouting = (
  routings: object, res: Response, next: any
) => {
    // FIXME: Set the type of next to something sensible!
    console.log("Applying routings %s", JSON.stringify(routings));
    setRoutingOnNginx(routings).then( (result: any) => {
      res.send({ mappings: routings });
    },
    (error: any) => {
      res.status(500);
      res.send({ message: "Failed to execute playbook" });
    })

    next();
}

let server = createServer();
server.use(plugins.bodyParser({
}));


const setMultipleRoutings = (
  req: Request, res: Response, next: any
) => {
  const routings = req.body;
  setRouting(routings, res, next);
}

server.post('/api/v1/routing', setMultipleRoutings);

const setSingleRouting = (
  req: Request, res: Response, next: any
) => {
  const newSource = req.body.source;
  if (newSource == undefined) {
    res.status(400);
    res.send({ message: "No source specified" });
    return;
  }

  const routing = { [req.params.stream]: newSource.toString() };
  setRouting(routing, res, next);
}

server.put('/api/v1/routing/:stream', setSingleRouting);


server.listen(3000, () => {
  console.log('%s listening at %s', server.name, server.url);
});
