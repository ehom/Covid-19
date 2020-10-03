const URL = 'https://raw.githubusercontent.com/ehom/external-data/master/finnhub/covid.json';
const userLanguage = navigator.language;

$.getJSON(URL, (json_data) => {
  render(json_data);
});

function render(listOfObjs) {
  ReactDOM.render(<Title/>,
                  document.getElementById('title'));

  ReactDOM.render(<ReportDate/>,
                  document.getElementById('date'));
  
  ReactDOM.render(<Statistics data={listOfObjs}/>,
                  document.getElementById('parent'));
}

function Title() {
  // TODO: put this user-facing message in an application stirng resource
  // https://stackoverflow.com/questions/39758136/render-html-string-as-real-html-in-a-react-component

  return <h1 class='title'>Covid-19 Statistics</h1>;
}

function Summary(props) {
  const summarize = (data) => {
    let totalCases = 0;
    let totalDeaths = 0;
  
    for (const obj of data) {
      totalCases += obj.case;
      totalDeaths += obj.death;
    }
    return {
      totalCases: totalCases,
      totalDeaths: totalDeaths
    };
  };
  
  let summary = summarize(props.data);

  console.debug(summary.totalCases);
  console.debug(summary.totalDeaths);
  
  const percentage = new Intl.NumberFormat(userLanguage, {
    style: 'percent'
  }).format(summary.totalDeaths / summary.totalCases);
  
  const formatter = new Intl.NumberFormat(userLanguage);
  summary.totalCases = formatter.format(summary.totalCases);
  summary.totalDeaths = formatter.format(summary.totalDeaths);

  // TODO: put this user-facing message in 
  // an application stirng resource

  return (
    <div class="alert alert-danger">
      <p>There are <span class="display-4">{summary.totalCases}</span> reported cases. <span class="display-4">{summary.totalDeaths}</span> people have died from Covid-19.</p>
    </div>
  );
}

function ReportDate() {
  const reportDate = new Intl.DateTimeFormat(userLanguage, {
    'weekday': 'long',
    'day': 'numeric',
    'month': 'long',
    'year': 'numeric'
  }).format(new Date(document.lastModified));
  
  return <p class="mb-3">{reportDate}</p>;
}

function Statistics(props) {
  console.debug(props);
  
  const listOfObjs = props.data;
  
  listOfObjs.sort((a, b) => {
    return (a.case <= b.case);
  });
  
  const buildTableRows = (objects) => {
    const numFormatter = new Intl.NumberFormat(userLanguage);
    const percentFormatter = new Intl.NumberFormat(userLanguage, {
      style: 'percent'
    });
    
    return objects.map((obj) => {
      return (
        <tr>
          <td>{obj.state}</td>
          <td class="number-col">{numFormatter.format(obj.case)}</td>
          <td class="number-col">{numFormatter.format(obj.death)}</td>
          <td class="number-col">{percentFormatter.format(obj.death / obj.case)}</td>
        </tr>
      );
    });
  };
  
  const tableRows = buildTableRows(listOfObjs);

  return (
    <React.Fragment>
      <Summary data={listOfObjs}/>
      <table class="table table-striped table-hover table-responsive-sm">
        <thead>
          <th scope="col">State</th>
          <th scope="col" class="number-col">Cases</th>
          <th scope="col" class="number-col">Deaths</th>
          <th scope="col" class="number-col">%</th>
        </thead>
        <tbody>{tableRows}</tbody>
      </table>
    </React.Fragment>
  );
}
