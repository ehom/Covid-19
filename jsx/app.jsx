const userLanguage = navigator.language;
const JSON_DATA = 'https://raw.githubusercontent.com/ehom/external-data/master/finnhub/covid.json';

$.getJSON(JSON_DATA, (json_data) => {
  ReactDOM.render(<Report data={json_data} />,
                  document.getElementById('root'));
});

const Report = (props) => {
  return (
    <React.Fragment>
      <div className="jumbotron pb-3">
        <Title/>
        <ReportDate/>
      </div>
      <div className="container mb-5">
        <Statistics data={props.data} />
      </div>
      <hr/>
    </React.Fragment>
  );
};

// TODO: put this user-facing message in an application string resource
// https://stackoverflow.com/questions/39758136/render-html-string-as-real-html-in-a-react-component

const Title = () => <h1 className='title'>Covid-19 Statistics</h1>;

const Summary = (props) => {
  // TODO -- there should be a better way to do this
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
    <div className="alert alert-danger">
      <p>Of <span className="display-4">{summary.totalCases}</span> reported cases,
      <span class="display-4"> {summary.totalDeaths}</span> people have died from Covid-19.</p>
    </div>
  );
};

const ReportDate = () => {
  const reportDate = new Intl.DateTimeFormat(userLanguage, {
    'weekday': 'long',
    'day': 'numeric',
    'month': 'long',
    'year': 'numeric'
  }).format(new Date());
  
  return <p className="mb-3">{reportDate}</p>;
};

const Statistics = (props) => {
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
          <td className="number-col">{numFormatter.format(obj.case)}</td>
          <td className="number-col">{numFormatter.format(obj.death)}</td>
          <td className="number-col">{percentFormatter.format(obj.death / obj.case)}</td>
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
          <th scope="col" className="number-col">Cases</th>
          <th scope="col" className="number-col">Deaths</th>
          <th scope="col" className="number-col">%</th>
        </thead>
        <tbody>{tableRows}</tbody>
      </table>
    </React.Fragment>
  );
};
