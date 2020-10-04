var URL = 'https://raw.githubusercontent.com/ehom/external-data/master/finnhub/covid.json';
var userLanguage = navigator.language;

$.getJSON(URL, function (json_data) {
  render(json_data);
});

function render(listOfObjs) {
  ReactDOM.render(React.createElement(Title, null), document.getElementById('title'));

  ReactDOM.render(React.createElement(ReportDate, null), document.getElementById('date'));

  ReactDOM.render(React.createElement(Statistics, { data: listOfObjs }), document.getElementById('parent'));
}

function Title() {
  // TODO: put this user-facing message in an application stirng resource
  // https://stackoverflow.com/questions/39758136/render-html-string-as-real-html-in-a-react-component

  return React.createElement(
    'h1',
    { className: 'title' },
    'Covid-19 Statistics'
  );
}

function Summary(props) {
  var summarize = function summarize(data) {
    var totalCases = 0;
    var totalDeaths = 0;

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var obj = _step.value;

        totalCases += obj.case;
        totalDeaths += obj.death;
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    return {
      totalCases: totalCases,
      totalDeaths: totalDeaths
    };
  };

  var summary = summarize(props.data);

  console.debug(summary.totalCases);
  console.debug(summary.totalDeaths);

  var percentage = new Intl.NumberFormat(userLanguage, {
    style: 'percent'
  }).format(summary.totalDeaths / summary.totalCases);

  var formatter = new Intl.NumberFormat(userLanguage);
  summary.totalCases = formatter.format(summary.totalCases);
  summary.totalDeaths = formatter.format(summary.totalDeaths);

  // TODO: put this user-facing message in 
  // an application stirng resource

  return React.createElement(
    'div',
    { className: 'alert alert-danger' },
    React.createElement(
      'p',
      null,
      'There are ',
      React.createElement(
        'span',
        { className: 'display-4' },
        summary.totalCases
      ),
      ' reported cases. ',
      React.createElement(
        'span',
        { className: 'display-4' },
        summary.totalDeaths
      ),
      ' people have died from Covid-19.'
    )
  );
}

function ReportDate() {
  var reportDate = new Intl.DateTimeFormat(userLanguage, {
    'weekday': 'long',
    'day': 'numeric',
    'month': 'long',
    'year': 'numeric'
  }).format(new Date(document.lastModified));

  return React.createElement(
    'p',
    { className: 'mb-3' },
    reportDate
  );
}

function Statistics(props) {
  console.debug(props);

  var listOfObjs = props.data;

  listOfObjs.sort(function (a, b) {
    return a.case <= b.case;
  });

  var buildTableRows = function buildTableRows(objects) {
    var numFormatter = new Intl.NumberFormat(userLanguage);
    var percentFormatter = new Intl.NumberFormat(userLanguage, {
      style: 'percent'
    });

    return objects.map(function (obj) {
      return React.createElement(
        'tr',
        null,
        React.createElement(
          'td',
          null,
          obj.state
        ),
        React.createElement(
          'td',
          { className: 'number-col' },
          numFormatter.format(obj.case)
        ),
        React.createElement(
          'td',
          { className: 'number-col' },
          numFormatter.format(obj.death)
        ),
        React.createElement(
          'td',
          { className: 'number-col' },
          percentFormatter.format(obj.death / obj.case)
        )
      );
    });
  };

  var tableRows = buildTableRows(listOfObjs);

  return React.createElement(
    React.Fragment,
    null,
    React.createElement(Summary, { data: listOfObjs }),
    React.createElement(
      'table',
      { className: 'table table-striped table-hover table-responsive-sm' },
      React.createElement(
        'thead',
        null,
        React.createElement(
          'th',
          { scope: 'col' },
          'State'
        ),
        React.createElement(
          'th',
          { scope: 'col', className: 'number-col' },
          'Cases'
        ),
        React.createElement(
          'th',
          { scope: 'col', className: 'number-col' },
          'Deaths'
        ),
        React.createElement(
          'th',
          { scope: 'col', className: 'number-col' },
          '%'
        )
      ),
      React.createElement(
        'tbody',
        null,
        tableRows
      )
    )
  );
}