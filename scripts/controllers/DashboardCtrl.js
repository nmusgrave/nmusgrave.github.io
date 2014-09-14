personalSiteApp.controller('dashboardController', function($scope, $q, $http) {
  var counter;
  var feedContents;
  var maxFeed = 100;
  
  $scope.wsj = [
    { Source: 'WSJ',
      Category: 'Tech',
      URL: 'http://online.wsj.com/xml/rss/3_7455.xml',
      Icon: 'fa-plug'},
    { Source: 'WSJ',
      Category: 'Opinion',
      URL: 'http://online.wsj.com/xml/rss/3_7041.xml',
      Icon: 'fa-pencil' },
    { Source: 'WSJ',
      Category: 'World',
      URL: 'http://online.wsj.com/xml/rss/3_7085.xml',
      Icon: 'fa-globe' }
    ];
  $scope.seattleTimes = [
    { Source: 'Seattle Times',
      Category: 'Biz/Tech',
      URL: 'http://seattletimes.com/rss/businesstechnology.xml',
      Icon: 'fa-plug' },
    { Source: 'Seattle Times',
      Category: 'Local',
      URL: 'http://seattletimes.com/rss/localnews.xml',
      Icon: 'fa-tree'}
    ];
  $scope.theStranger = [
    { Source: 'The Stranger',
      Category: 'Music',
      URL: 'http://www.thestranger.com/seattle/Rss.xml?section=307',
      Icon: 'fa-music' },
    { Source: 'The Stranger',
      Category: 'Features',
      URL: 'http://www.thestranger.com/seattle/Rss.xml?section=21227' },
    { Source: 'The Stranger',
      Category: 'Blogs',
      URL: 'http://www.thestranger.com/seattle/Rss.xml?categoryType=blog',
      Icon: 'fa-pencil'},
    ];
  $scope.techCrunch =
    { Source: 'TechCrunch',
      Category: '',
      URL: 'http://feeds.feedburner.com/TechCrunch/',
      Icon: 'fa-plug' };
  $scope.wired = [
    { Source: 'Wired',
      Category: 'Features',
      URL: 'http://feeds.wired.com/wired/index',
      Icon: 'fa-plug'},
    { Source: 'Wired',
      Category: 'Photography',
      URL: 'http://feeds.wired.com/RawFile',
      Icon: 'fa-camera'},
    { Source: 'Wired',
      Category: 'Design',
      URL: 'http://feeds.wired.com/wired/design',
      Icon: 'fa-paint-brush'},
    { Source: 'Wired',
      Category: 'Science',
      URL: 'http://feeds.wired.com/wiredscience' },
    { Source: 'Wired',
      Category: 'Enterprise',
      URL: 'http://feeds.wired.com/wiredenterprise/',
      Icon: 'fa-sitemap'},
  ];
  
  var getWeather = function(zip) {
    var deferred = $q.defer();
    $http.get('https://query.yahooapis.com/v1/public/yql?q=SELECT%20*%20FROM%20weather.forecast%20WHERE%20location%3D%22' + zip + '%22&format=json&diagnostics=true&callback=')
    .success(
      function(data){
        deferred.resolve(data.query.results.channel);
      }
    ).error(
      function(err){
        //console.log('Error retrieving weather');
        deferred.reject(err);
      }
    );
    return deferred.promise;
  };
  
  var getFeed = function(feedURL) {
    var feed = new google.feeds.Feed(feedURL);
    feed.setNumEntries(maxFeed);
    feed.load(
      function(result) {
        if (!result.error) {
          //needs $apply for angular to notice the assignment on first load
          $scope.$apply(function() {
            feedContents = result.feed.entries;
            $scope.loadMore();
          });
        }
      }
    );
  };
  
  $scope.switchFeed = function(feedURL) {
    $scope.loading = true;
    feedContents = [];
    counter = 0;
    $scope.items = [];
    google.setOnLoadCallback(getFeed(feedURL));
  };
  
  $scope.loadMore = function() {
    var time = new Date();
    var temp;
    var then;
    if (feedContents.length > 0 && $scope.items.length < maxFeed) {
      i= 1;
      while(i < 10 && counter < feedContents.length) {
        counter = counter+1;
        //calculate age
        then = new Date(feedContents[counter].publishedDate);
        temp = time.getDate() - then.getDate();
        if(temp > 1)
          feedContents[counter].age = temp + ' days ago';
        else if(temp == 1)
          feedContents[counter].age = temp + ' day ago';
        else //temp == 0
          feedContents[counter].age = (time.getHours() - then.getHours()) + ' hours ago';
        $scope.items.push(feedContents[counter]);
        i++;
      }
      $scope.loading = false;
    }
  };
  
  var init = function() {
    getWeather(98105).then(
      function(data) {
        $scope.weather = data;
      }
    );
  };
  
  init();
  
});