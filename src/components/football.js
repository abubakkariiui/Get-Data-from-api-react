import React, { Component } from 'react';
import { styled } from '@stitches/react';

// const cachedResponses = {};

export default class FootballMatches extends Component {
  state = {
    selectedYear: null,
    fetchState: { status: 'loading', fail: { status: false, reason: null } },
    currentYearMatches: { count: 0, meta: [] }
  };

  setFetchState = (state) => {
    return this.setState((prevState) => ({
      ...prevState,
      fetchState: {
        ...prevState.fetchState,
        ...state
      }
    }));
  };

  getApiUrlWithYear = (year) => {
    return `https://jsonmock.hackerrank.com/api/football_competitions?year=${year}`;
  };

  fetchMatchData = (year) => {
    return fetch(this.getApiUrlWithYear(year))
      .then((res) => res.json())
      .then(this.handleMatchData)
      .catch(this.handleFetchError);
  };

  // checkAndReturnFromCache = (year) => {
  //   const match = cachedResponses[year];

  //   return this.setState((prevState) => ({
  //     ...prevState,
  //     currentYearMatches: {
  //       ...prevState.currentYearMatches,
  //       count: match.total,
  //       meta: match.data
  //     }
  //   }));
  // };

  // cacheResponse = (response) => {
  //   cachedResponses[this.state.selectedYear] = response;
  //   return;
  // };

  handleMatchData = (match) => {
    this.setFetchState({ status: 'done' });

    return this.setState((prevState) => ({
      ...prevState,
      currentYearMatches: {
        ...prevState.currentYearMatches,
        count: match.total,
        meta: match.data
      }
    }));
  };

  handleFetchError = (error) => {
    return this.setFetchState({
      status: 'done',
      fail: {
        status: true,
        reason: error
      }
    });
  };

  handleYearSelection = (year) => (e) => {
    this.setState((prevState) => ({
      ...prevState,
      selectedYear: year
    }));

    this.fetchMatchData(year);
  };

  render() {
    const years = ['2011', '2012', '2013', '2014', '2015', '2016', '2017'];

    return (
      <section>
        <h1>Football Competitions</h1>
        {years.map((year) => (
          <Button
            key={year}
            color={this.state.selectedYear === year && 'active'}
            onClick={this.handleYearSelection(year)}
          >
            {year}
          </Button>
        ))}

        {this.state.selectedYear && (
          <MatchDetailsSection>
            <LoadingAwareSection loading={this.state.fetchState.status}>
              {this.state.currentYearMatches.count === 0 ? (
                <>
                  <h2>No Matches Found</h2>
                </>
              ) : (
                <>
                  <h2 data-testid="match-count">
                    Total Matches: {this.state.currentYearMatches?.count}
                  </h2>

                  <div data-testid="matches-data">
                    {this.state.currentYearMatches.meta.map((match) => (
                      <h3 key={match?.name}>
                        Match {match?.name} won by {match?.winner}
                      </h3>
                    ))}
                  </div>
                </>
              )}
            </LoadingAwareSection>
          </MatchDetailsSection>
        )}
      </section>
    );
  }
}

function LoadingAwareSection({ loading, children }) {
  if (loading === 'loading') {
    return null;
  }

  return <section>{children}</section>;
}

const Button = styled('button', {
  backgroundColor: 'gainsboro',
  border: 'none',
  borderRadius: '9999px',
  fontSize: '13px',
  padding: '10px 15px',
  margin: '0 0.2rem',
  cursor: 'pointer',

  variants: {
    color: {
      active: {
        backgroundColor: 'Coral'
      }
    }
  }
});

const MatchDetailsSection = styled('section', {
  margin: '1rem'
});
