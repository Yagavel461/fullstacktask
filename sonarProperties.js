const SonarQubeScanner = require('sonarqube-scanner');

SonarQubeScanner(
	{
		serverUrl: 'http://localhost:9000/',
		options: {
			'sonar.projectDescription': 'This is a Node JS application',
			'sonar.projectName': 'qks023-ippopay-store-admin-node-api',
			'sonar.projectKey': 'qks023-ippopay-store-admin-node-api',
			'sonar.token': 'sqa_4aa4a22d4c2863044a9da5e715add15fb1764a03',
			'sonar.projectVersion': '3.0',
			'sonar.language': 'js',
			'sonar.sourceEncoding': 'utf8',
			'sonar.sources': '.',
			//'sonar.tests': 'specs',
			//'sonar.inclusions' : 'src/**'
			'sonar.java.binaries': '**/*.java'
		}
	},
	() => {}
);
