import React from 'react';
import PropTypes from 'prop-types';
import styled, {css} from 'react-emotion';

import SentryTypes from 'app/sentryTypes';
import {Panel, PanelHeader, PanelBody, PanelItem} from 'app/components/panels';
import LoadingIndicator from 'app/components/loadingIndicator';
import overflowEllipsis from 'app/styles/overflowEllipsis';
import EmptyStateWarning from 'app/components/emptyStateWarning';
import {t} from 'app/locale';
import space from 'app/styles/space';

import {SPECIAL_FIELDS} from './data';

export default class Table extends React.Component {
  static propTypes = {
    view: SentryTypes.EventView.isRequired,
    data: PropTypes.arrayOf(PropTypes.object),
    isLoading: PropTypes.bool,
    organization: SentryTypes.Organization.isRequired,
  };

  renderBody() {
    const {view, data, isLoading, organization} = this.props;
    const {fields} = view.data;

    if (isLoading) {
      return <LoadingIndicator />;
    }

    if (data && data.length === 0) {
      return (
        <EmptyStateWarning>
          <p>{t('No results found')}</p>
        </EmptyStateWarning>
      );
    }

    return data.map((row, idx) => (
      <Row key={idx} className={getGridStyle(fields.length)}>
        {fields.map(field => (
          <Cell key={field}>
            {SPECIAL_FIELDS.hasOwnProperty(field) ? (
              SPECIAL_FIELDS[field].renderFunc(row, organization)
            ) : (
              <Data>{row[field]}</Data>
            )}
          </Cell>
        ))}
      </Row>
    ));
  }

  render() {
    const {fields} = this.props.view.data;

    return (
      <Panel>
        <PanelHeader className={getGridStyle(fields.length)}>
          {fields.map(field => (
            <div key={field}>{field}</div>
          ))}
        </PanelHeader>
        <PanelBody>{this.renderBody()}</PanelBody>
      </Panel>
    );
  }
}

function getGridStyle(colCount) {
  return css`
    display: grid;
    grid-template-columns: 3fr repeat(${colCount - 1}, 1fr);
    grid-gap: ${space(1)};
  `;
}

const Row = styled(PanelItem)`
  font-size: ${p => p.theme.fontSizeMedium};
`;

const Cell = styled('div')`
  overflow: hidden;
`;

const Data = styled('div')`
  ${overflowEllipsis}
`;
