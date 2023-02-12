### Jenkins For Azure

```javascript
// jenkins 상태
service jenkins status
// jenkins 암호 (ea80f66065f84ad48ed73862f21b17b5)
sudo cat /var/lib/jenkins/secrets/initialAdminPassword
// jenkins 재시작
sudo service jenkins restart

wget -qO - [https://pkg.jenkins.io/debian-stable/jenkins.io.key](https://pkg.jenkins.io/debian-stable/jenkins.io.key) | sudo apt-key add - sh -c 'echo deb [https://pkg.jenkins.io/debian-stable](https://pkg.jenkins.io/debian-stable) binary/ > /etc/apt/sources.list.d/jenkins.list'

- sudo apt-get update && sudo apt-get install jenkins -y
- sudo service jenkins restart
```

Jenkins 2.375.3 버전은 JAVA 11 버전에서 설치가 가능하다.
워크 스페이스 경로 : /var/lib/jenkins/workspace
ant 경로 : /var/lib/jenkins/tools/hudson.tasks.Ant_AntInstallation/ant-1.9.7/lib
