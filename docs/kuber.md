Initialize fractal communication framework in Rust

Add implementation of Mandelbrot-inspired cognitive processing architecture
with multi-scale fractal patterns and therapeutic anchors. Include core
theoretical documentation and basic project structure.
 


<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Kubernetes for Administrators](#kubernetes-for-administrators)
  - [Learning Outcomes](#learning-outcomes)
  - [What tools we will need](#what-tools-we-will-need)
  - [Pod Based Architecture](#pod-based-architecture)
  - [Creating Pods](#creating-pods)
    - [Specifying Resource Constraints](#specifying-resource-constraints)
    - [Health Checks](#health-checks)
    - [Multi-container pods](#multi-container-pods)
  - [Labels, Selectors and Annotations](#labels-selectors-and-annotations)
  - [Service Discovery and Services](#service-discovery-and-services)
  - [Deployments](#deployments)
  - [Storage](#storage)
  - [ConfigMaps and Secrets](#configmaps-and-secrets)
  - [Deploy microservices with proper labels and deployments](#deploy-microservices-with-proper-labels-and-deployments)
  - [Security](#security)
    - [RBAC](#rbac)
  - [Things Beyond This Course](#things-beyond-this-course)
    - [Operators](#operators)
    - [Helm](#helm)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Kubernetes for Administrators

## Learning Outcomes

* Create pods declarative and imperatively
* Organize resources using labels
* Discover services
* Control how applications are exposed outside the cluster
* Use deployments for application lifecycle
* Manage storage for containers
* Pass configuration to containers
* Use proper API objects for different jobs
* Integrate with logging and metrics
* Understand namespaces and security


## What tools we will need

* kubectl  - <https://kubernetes.io/docs/tasks/tools/install-kubectl/>
* 5 Node Kubernetes Cluster - <https://www.katacoda.com/courses/kubernetes/playground>


## Pod Based Architecture

A pod is the basic building block of kubernetes.

* One or more containers
* Shared networking
* Shared filesystem
* NOT DURABLE

Pods die. Pods die all of the time. You want to kill pods. You want to scale the number of running pods up. You want to scale the number of running pods down. You want to deploy new pods when you do a release.

Pods dying is OK.

Pods live in a namespace.

State doesn't live in pods, but somewhere else. Pods consume state, pods don't store state.

Pod related commands:

```
kubectl get pods [--namespace]
kubectl get pods --all-namespaces
kubectl describe pod <pod-name>
kubectl logs pod <pod-name>
kubectl delete pod <pod-name>
kubectl port-forward pod <pod-name>
```

## Creating Pods

### Specifying Resource Constraints

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: frontend
spec:
  containers:
  - name: app
    image: images.my-company.example/app:v4
    resources:
      requests:
        memory: "64Mi"
        cpu: "250m"
      limits:
        memory: "128Mi"
        cpu: "500m"
```

Other Resources:

* <https://kubernetes.io/docs/concepts/configuration/manage-compute-resources-container/>

### Health Checks

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: liveness-exec
spec:
  containers:
  - name: liveness
    image: k8s.gcr.io/busybox
    args:
    - /bin/sh
    - -c
    - touch /tmp/healthy; sleep 30; rm -rf /tmp/healthy; sleep 600
    livenessProbe:
      exec:
        command:
        - cat
        - /tmp/healthy
      initialDelaySeconds: 3
      periodSeconds: 5
```

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: goproxy
  labels:
    app: goproxy
spec:
  containers:
  - name: goproxy
    image: k8s.gcr.io/goproxy:0.1
    ports:
    - containerPort: 8080
    readinessProbe:
      tcpSocket:
        port: 8080
      initialDelaySeconds: 5
      periodSeconds: 10
    livenessProbe:
      tcpSocket:
        port: 8080
      initialDelaySeconds: 15
      periodSeconds: 20
```

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: liveness-http
spec:
  containers:
  - name: liveness
    image: k8s.gcr.io/liveness
    args:
    - /server
    livenessProbe:
      httpGet:
        path: /healthz
        port: 8080
        httpHeaders:
        - name: X-Custom-Header
          value: Awesome
      initialDelaySeconds: 3
      periodSeconds: 3
```

Other Resources:

* <https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-probes/>

### Multi-container pods

```
apiVersion: v1
kind: Pod
metadata:
  name: redis-django
  labels:
    app: web
spec:
  containers:
  - name: key-value-store
    image: redis
    ports:
    - containerPort: 6379
  - name: frontend
    image: django
    ports:
    - containerPort: 8000
```

Exercise:

* Create and verify a pod has been created
* Retrieve its logs
* Delete a pod

## Labels, Selectors and Annotations

Labels tell kubernetes about related pods. Selectors let us find resources by labels.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: frontend-prod
  labels:
    app: frontend
    env: prod
    tier: frontend
spec:
  containers:
  - name: app
    image: images.my-company.example/app:v4
    resources:
      requests:
        memory: "64Mi"
        cpu: "250m"
      limits:
        memory: "128Mi"
        cpu: "500m"
```

Selectors:

```
kubectl get pods -l 'env in (dev, test)'
kubectl get pods -l 'env=prod,tier=frontend'
kubectl get pods -l 'env!=prod'
```

Annotations provide a place to store additional metadata for Kubernetes objects with the sole purpose of assisting tools and libraries.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: annotations-demo
  annotations:
    imageregistry: "https://hub.docker.com/"
spec:
  containers:
  - name: nginx
    image: nginx:1.7.9
    ports:
    - containerPort: 80
```

Other Resources:

* <https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/>
* <https://kubernetes.io/docs/concepts/overview/working-with-objects/annotations/>

Exercise:

* Create three pods with different labels
* View the created pods with different label selectors
* Delete the pods with a label selector

## Service Discovery and Services

Services allow pods to talk to each other when they're distributed around the cluster. They provide an interface to access the pods no matter where they are.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  selector:
    app: MyApp
  ports:
  - protocol: TCP
    port: 80
    targetPort: 9376
```

Other Resources:

* <https://kubernetes.io/docs/concepts/services-networking/service/>

Exercise:

* Create a service
* Expose a service on a port
* See the deployed service

## Deployments

Deployments help with rolling upgrades.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  labels:
    app: nginx
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.7.9
        ports:
        - containerPort: 80
```

Other Resources:

* <https://kubernetes.io/docs/concepts/workloads/controllers/deployment/>

Exercise:

* Create a deployment
* Update it
* Scale it up
* Scale it down
* Expose a port for apps in the deployment

## Storage

Kubernetes volumes give us durable storage.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: redis
spec:
  containers:
  - name: redis
    image: redis
    volumeMounts:
    - name: redis-storage
      mountPath: /data/redis
  volumes:
  - name: redis-storage
    emptyDir: {}
```

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: pv0003
spec:
  capacity:
    storage: 5Gi
  volumeMode: Filesystem
  accessModes:
    - ReadWriteOnce
  persistentVolumeReclaimPolicy: Recycle
  storageClassName: slow
  mountOptions:
    - hard
    - nfsvers=4.1
  nfs:
    path: /tmp
    server: 172.17.0.2
```

Other Resources:

* <https://kubernetes.io/docs/concepts/storage/volumes/>
* <https://kubernetes.io/docs/concepts/storage/persistent-volumes/>

Exercise:

* Create a pod with a volume
* Run a command in the container to add a file on the volume
* Delete the pod and verify it's deleted
* Create another pod with the same storage
* See that the data has persisted

## ConfigMaps and Secrets

We can pass data from the cluster into containers.

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: game-demo
data:
  # property-like keys; each key maps to a simple value
  player_initial_lives: 3
  ui_properties_file_name: "user-interface.properties"
  #
  # file-like keys
  game.properties: |
    enemy.types=aliens,monsters
    player.maximum-lives=5
  user-interface.properties: |
    color.good=purple
    color.bad=yellow
    allow.textmode=true
    how.nice.to.look=fairlyNice
```

Mounted in a volume:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: configmap-demo-pod
spec:
  containers:
    - name: demo
      image: game.example/demo-game
      volumeMounts:
      - name: config
        mountPath: "/config"
        readOnly: true
  volumes:
    # You set volumes at the Pod level, then mount them into containers inside that Pod
    - name: config
      configMap:
        # Provide the name of the ConfigMap you want to mount.
        name: game-demo
        # An array of keys from the ConfigMap to create as files
        items:
        - key: "game.properties"
          path: "game.properties"
        - key: "user-interface.properties"
          path: "user-interface.properties"
```

In the environment:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: dapi-test-pod
spec:
  containers:
    - name: test-container
      image: k8s.gcr.io/busybox
      command: [ "/bin/sh", "-c", "env" ]
      env:
        # Define the environment variable
        - name: SPECIAL_LEVEL_KEY
          valueFrom:
            configMapKeyRef:
              # The ConfigMap containing the value you want to assign to SPECIAL_LEVEL_KEY
              name: special-config
              # Specify the key associated with the value
              key: special.how
  restartPolicy: Never
```

All the ConfigMap keys:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: dapi-test-pod
spec:
  containers:
    - name: test-container
      image: k8s.gcr.io/busybox
      command: [ "/bin/sh", "-c", "env" ]
      envFrom:
      - configMapRef:
          name: special-config
  restartPolicy: Never
```

Secrets:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: mysecret
type: Opaque
data:
  username: YWRtaW4=
  password: MWYyZDFlMmU2N2Rm
```

Via files:

```
# Create files needed for rest of example.
$ echo -n 'admin' > ./username.txt
$ echo -n '1f2d1e2e67df' > ./password.txt

$ kubectl create secret generic db-user-pass --from-file=./username.txt --from-file=./password.txt
secret "db-user-pass" created
```

Other Resources:

* <https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/>
* <https://kubernetes.io/docs/concepts/configuration/secret/>

Exercise:

* Create a pod with a ConfigMap
* Configure environment variables to have a string value
* Edit the ConfigMap
* See the updates reflected in a new pod

## Deploy microservices with proper labels and deployments

(Time permitting)

Let's deploy a three tier application using kubernetes services, deployments and configuration. There's a database, a service tier, and a frontend.

```
// database-deployment.yaml

apiVersion: apps/v1
kind: Deployment
metadata:
  name: database
  labels:
    app: database
spec:
  replicas: 1
  selector:
    matchLabels:
      app: database
  template:
    metadata:
      labels:
        app: database
    spec:
      containers:
      - name: database
        image: postgres:11
        env:
        - name: POSTGRES_USER
          value: postgres
        - name: POSTGRES_PASSWORD
          value: postgres
        ports:
        - containerPort: 5432
```

```
// database-service.yaml

apiVersion: v1
kind: Service
metadata:
  name: database
spec:
  selector:
    app: database
  ports:
  - protocol: TCP
    port: 5432
```

```
// service-deployment.yaml

apiVersion: apps/v1
kind: Deployment
metadata:
  name: service
  labels:
    app: service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: service
  template:
    metadata:
      labels:
        app: service
    spec:
      containers:
      - name: service
        image: <your-image>:latest
        env:
        - name: APP_DB_USER
          value: postgres
        - name: APP_DB_PASS
          value: postgres
        - name: APP_DB_NAME
          value: postgres
        - name: APP_DB_URL
          value: database
        ports:
        - containerPort: 8000
```

```
// service-service.yaml

apiVersion: v1
kind: Service
metadata:
  name: service
spec:
  selector:
    app: service
  ports:
  - protocol: TCP
    port: 8000
    targetPort: 8000
```

```
// frontend-deployment.yaml

apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
  labels:
    app: frontend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: frontend
  template:
    metadata:
      labels:
        app: frontend
    spec:
      containers:
      - name: frontend
        image: <your-image>:latest
        env:
        - name: APP_SERVICE_URL
          value: service
        ports:
        - containerPort: 5000
```

```
// frontend-service.yaml

apiVersion: v1
kind: Service
metadata:
  name: frontend
spec:
  ports:
  - port: 5000
  selector:
    app: frontend
  type: LoadBalancer
```

Exercise:

* Assemble this stack
* Scale each part up or down
* Delete the database and recreate it
* Update services

## Security

<https://kubernetes.io/docs/reference/access-authn-authz/controlling-access/>

### RBAC

```
// developer-role.yaml
kind: Role
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  namespace: default
  name: developer
rules:
- apiGroups: ["", "extensions", "apps"]
  resources: ["pods"]
  verbs: ["get", "list", "watch"]
```

```
// developer-binding.yaml
kind: RoleBinding
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: developer-binding
  namespace: default
subjects:
- kind: User
  name: developer
  apiGroup: ""
roleRef:
  kind: Role
  name: developer
  apiGroup: ""
```


## Things Beyond This Course

### Operators

Kubernetes lets us define complex deployments using operators. To give an idea of the power of this, here's the simplest operator we could write:

```
apiVersion: apps/v1
kind: Deployment
metadata:
  name: wordpress-operator
spec:
  replicas: 1
  selector:
    matchLabels:
      name: wordpress-operator
  template:
    metadata:
      labels:
        name: wordpress-operator
    spec:
      containers:
        - name: wordpress-operator
          image: wordpress-operator:latest
```

This would run a simple wordpress operator that watches for requests to create a wordpress site and applies the right set of objects to handle them.

### Helm

<https://helm.sh/>

Helm helps us manage kubernetes applications. Install helm. (instructions at <https://github.com/helm/helm#install>)

```
> helm install stable/wordpress
```

That's a much easier way to install a complex application.
End File# thoughtworks/presentations
# infrastructure-as-code.html
<!doctype html>
<html>
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">

		<title>Infrastructure as Code</title>

		<link rel="stylesheet" href="css/reveal.css">
		<link rel="stylesheet" href="css/theme/tw.css">

		<!-- Theme used for syntax highlighting of code -->
		<link rel="stylesheet" href="lib/css/zenburn.css">

		<!-- Printing and PDF exports -->
		<script>
			var link = document.createElement( 'link' );
			link.rel = 'stylesheet';
			link.type = 'text/css';
			link.href = window.location.search.match( /print-pdf/gi ) ? 'css/print/pdf.css' : 'css/print/paper.css';
			document.getElementsByTagName( 'head' )[0].appendChild( link );
		</script>
	</head>
	<body>
		<div class="reveal">
			<div class="slides">
        <section>
          <img src="img/thoughtworks_logo.png">
          <h2>Infrastructure as Code</h2>
        </section>
        <section>
          <h2>Who Am I?</h2>

          <div id="left">
            <img src="img/ian-lewis.jpg" alt="Ian Lewis" style="height: 250px;">
          </div>
          <div id="right">
            Ian Lewis<br />
            Developer, Tech Lead, Maker
            <br/>
            <a href="https://twitter.com/ianmlewis">@ianmlewis</a>
          </div>

          <aside class="notes">
            Hi I am Ian Lewis. I work as a developer for ThoughtWorks. So I work on software for clients and do trainings like this one.

            I also work on a software project called falco which is a web application security tool.

            I tweeet at ianmlewis on twitter. feel free to reach out to me there if you have any questions after today's training.
          </aside>
        </section>

        <section>
          <h2>Agenda</h2>

          <ul>
            <li>AWS Account Setup</li>
            <li>Overview of Infrastructure as Code</li>
            <li>Terrafom Basics</li>
            <li>Provisioning with Terraform</li>
          </ul>
        </section>

        <section>
          <section>
            <h2>AWS Account Setup</h2>
          </section>

          <section>
            <h2>Create an IAM User</h2>

            <div id="left">
              <ol>
                <li>Go to the IAM Users page
                <li>Choose "Add User"
                <li>For username choose "tf-workshop"
                <li>Check "Programmatic access" (don't check AWS Management Console access)
                <li>Click "Next: Permissions"
                <li>Choose "Attach existing policies directly"
                <li>Select "AdministratorAccess"
                <li>Click "Next: Tags"
                <li>Click "Next: Review"
                <li>Click "Create User"
                <li>Download the credentials csv
              </ol>
            </div>
            <div id="right">
              <img src="img/iam.png" style="width: 100%; margin: 0; box-shadow: none;">
            </div>
          </section>

          <section>
            <h2>Check your AWS Credentials</h2>

            <pre><code class="bash">$ export AWS_ACCESS_KEY_ID=xxxxxxxxxx
$ export AWS_SECRET_ACCESS_KEY=xxxxxxxxxxxxxxxx

$ aws sts get-caller-identity
{
    "Account": "XXXXXXXXXXXX",
    "UserId": "XXXXXXXXXXXXXXXXXXXXX",
    "Arn": "arn:aws:iam::XXXXXXXXXXXX:user/tf-workshop"
}</code></pre>
          </section>

          <section>
            <h2>Setup working directory for the workshop</h2>

            <pre><code class="bash">$ mkdir -p $HOME/workspace/tf-workshop
$ cd $HOME/workspace/tf-workshop</code></pre>

            <p>If you are on Windows, run `cmd.exe` and create the directory in a place of your choosing.</p>
          </section>
        </section>

        <section>
          <section>
            <h2>Infrastructure as Code</h2>
          </section>

          <section>
            <h2>What is Infrastructure as Code?</h2>

            <p>A process where you write <strong>code</strong> to define, provision, and manage infrastructure.</p>

            <aside class="notes">
              You declare how your infrastructure should be.
            </aside>
          </section>

          <section>
            <h2>Benefits of Infrastructure as Code</h2>

            <ul>
              <li class="fragment">You can test the infrastructure</li>
              <li class="fragment">Deployments are easy to understand</li>
              <li class="fragment">Deployments are idempotent</li>
              <li class="fragment">Infrastructure is easy to review</li>
              <li class="fragment">You can destroy and recreate infrastruture easily</li>
              <li class="fragment">Multiple environments can be easily maintained</li>
            </ul>

            <aside class="notes">
              You can test code
              Infrastructure is documented as code
              Deployments are idempotent
              You can review changes to infrastructure easily
              Infrastructure is reproducible
              You can create multiple environments exactly the same way
            </aside>
          </section>

          <section>
            <h2>Manual Infrastructure Management</h2>

            <div class="figure-container">
              <figure>
                <img src="img/manual.png" style="background: none; border: none; box-shadow: none;">
                <figcaption style="font-size: 0.4em">Image by Kief Morris</figcaption>
              </figure>
            </div>
          </section>

          <section>
            <h2>Scripted Infrastructure Management</h2>

            <div class="figure-container">
              <figure>
                <img src="img/scripted.png" style="background: none; border: none; box-shadow: none;">
                <figcaption style="font-size: 0.4em">Image by Kief Morris</figcaption>
              </figure>
            </div>
          </section>

          <section>
            <h2>Infrastruture as Code</h2>

            <div class="figure-container">
              <figure>
                <img src="img/iac.png" style="background: none; border: none; box-shadow: none;">
                <figcaption style="font-size: 0.4em">Image by Kief Morris</figcaption>
              </figure>
            </div>
          </section>

          <section>
            <h2>Infrastructure Tools</h2>

            <div class="flex-grid">
              <div>
                <h3>Provisioning</h3>
                <ul>
                  <li>Terraform</li>
                  <li>AWS CloudFormation</li>
                  <li>Pulumi</li>
                </ul>
              </div>
              <div>
                <h3>VM Management</h3>
                <ul>
                  <li>Vagrant</li>
                </ul>
              </div>
              <div>
                <h3>Configuration Management</h3>
                <ul>
                  <li>Puppet</li>
                  <li>Chef</li>
                  <li>Ansible</li>
                  <li>DSC</li>
                </ul>
              </div>
              <div>
                <h3>Container Management</h3>
                <ul>
                  <li>Kubernetes</li>
                  <li>Docker Compose</li>
                  <li>Helm</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2>Infrastructure Code Testing</h2>

            <ul>
              <li>Automated Testing
                <ul>
                  <li>Unit tests</li>
                  <li>Acceptance tests</li>
                  <li>Smoke tests</li>
                </ul>
              </li>
              <li>Continuous Integration</li>
              <li>Continuous Deployment</li>
            </ul>
          </section>
        </section>

        <section>
          <section>
            <h2>Terraform Basics</h2>
          </section>

          <section>
            <h2>What is Terraform?</h2>

            <p>Terraform is an infrastructure as code tool that can help you to:</p>

            <ul>
              <li class="fragment">Plan infrastructure changes</li>
              <li class="fragment">Create and maintain infrastructure</li>
              <li class="fragment">Safely destroy infrastructure that is no longer needed</li>
              <li class="fragment">Reuse infrastructure configurations</li>
            </ul>

            <aside class="notes">
              Terraform helps you plan infra changes
              Create infrastructure
              Destroy infrastructure
              Reuse infra configurations
            </aside>
          </section>

          <section>
            <h2>Terraform File Types</h2>

            <div class="flex-grid">
              <div>
                <h3>.tf</h3>
                <p>Configuration files using HCL (Hashicorp Configuration Language)</p>
              </div>
              <div>
                <h3>.tfvars</h3>
                <p>Files to define variables and their values</p>
              </div>
              <div>
                <h3>.tfstate</h3>
                <p>Files that contain the state of our infrastructure</p>
              </div>
              <div>
                <h3>terraform.tfstate.backup</h3>
                <p>Backup of the most recent infrastructure state</p>
              </div>
            </div>

            <aside class="notes">
              .tf - Terraform config files (HCL)
              .tfvars - Variables stored in files
              .tfstate - State of the infrastructure when it was deployed
              .tfstate.backup - A backup tfstate file
            </aside>
          </section>

          <section>
            <h2>A Basic Terraform File</h2>

            <pre><code class="shell">$ mkdir -p $HOME/workspace/tf-workshop/hello-world
$ cd $HOME/workspace/tf-workshop/hello-world
$ vi main.tf</code></pre>

            <pre><code class="ruby">provider "aws" {
  region = "us-east-1"
}

resource "aws_s3_bucket" "hello_world" {
  bucket = "hello-world-tf-workshop"
  acl    = "private"
}</code></pre>

            <aside class="notes">
              provider - tells terraform about the provider (AWS, GCS, Azure)
              resource - defines a resource (first arg is type, second is name)
            </aside>
          </section>

          <section>
            <h2>Terraform Init</h2>

            <pre><code class="shell">$ terraform init</code></pre>

            <p>Initialize terraform with the pre-requisites in order to run it<br />
            (downloads providers and modules)</p>
          </section>

          <section>
            <h2>Terraform Plan</h2>

            <pre><code class="shell">$ terraform plan</code></pre>

            <p>Show what would happen if you ran terraform without actually doing it.</p>
          </section>

          <section>
            <h2>Terraform Apply</h2>

            <pre><code class="shell">$ terraform apply</code></pre>

            <p>Apply the terraform changes, building out the plan and making it reality.</p>
          </section>

          <section>
            <h2>Terraform Destroy</h2>

            <pre><code class="shell">$ terraform destroy</code></pre>

            <p>Destroy all of the resources specified in your terraform.</p>
          </section>

          <section>
            <h2>Exercise</h2>

            <p>Create a Hello World terraform file:</p>

            <ol>
              <li>Change to the "hello-world" directory</li>
              <li>Create the main.tf file</li>
              <li>terraform init</li>
              <li>terraform plan</li>
              <li>terraform apply</li>
            </ol>

            <pre><code class="shell">$ cd ~/workspace/tf-workshop/hello-world
$ vi main.tf
provider "aws" {
  region = "us-east-1"
}

resource "aws_s3_bucket" "hello_world" {
  bucket = "hello-world-${random_id.bucket.hex}"
}

resource "random_id" "bucket" {
  byte_length = 8
}
