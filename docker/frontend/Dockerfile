FROM ubuntu:22.04
RUN apt-get update
RUN DEBIAN_FRONTEND=noninteractive apt-get install -y tzdata
ENV TZ=UTC-3
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Install node
RUN apt-get update --fix-missing
RUN apt-get install -y curl wget openssh-client git vim
RUN curl -sL https://deb.nodesource.com/setup_18.x | bash -
RUN apt-get install -y nodejs
RUN apt-get install -y nginx
COPY host.conf /etc/nginx/sites-available/default

#CMD ["/usr/sbin/nginx", "-g", "daemon off;"]

