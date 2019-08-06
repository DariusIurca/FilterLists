import { Table } from 'antd';
import * as React from "react";
import { SubscribeButton } from '../../shared';
import { nameof } from '../../utils';
import './AllListsTable.css';
import { List } from './List';

interface State {
  data: List[];
  pageSize: number;
  pageSizeOptions: string[];
  isNarrowWindow: boolean;
}

export class AllListsTable extends React.Component<{}, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      data: [],
      pageSize: 0,
      pageSizeOptions: [],
      isNarrowWindow: false
    };
    this.updatePageSize = this.updatePageSize.bind(this);
  }

  componentDidMount() {
    this.updatePageSize();
    window.addEventListener('resize', this.updatePageSize);

    fetch("/api/v1/lists")
      .then(response => response.json())
      .then(json => { this.setState({ data: json }); })
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updatePageSize);
  }

  updatePageSize() {
    const pageSize = Math.floor((window.innerHeight - 275.5) / 59);
    this.setState({
      pageSize: pageSize,
      pageSizeOptions: [5, 10, 20, 500, 2000, pageSize].sort((a, b) => a - b).map(String),
      isNarrowWindow: window.innerWidth < 576 ? true : false
    });
  }

  render() {
    return (
      <Table<List>
        dataSource={this.state.data}
        rowKey={record => record.id.toString()}
        loading={this.state.data.length === 0 ? true : false}
        size="small"
        pagination={{
          size: "small",
          pageSize: this.state.pageSize,
          showSizeChanger: true,
          pageSizeOptions: this.state.pageSizeOptions
        }}
        scroll={{ x: this.state.isNarrowWindow ? 576 : 1600 }}>
        <Table.Column<List>
          title="Name"
          dataIndex={nameof<List>("name")}
          width={200}
          fixed="left"
          render={(text: string) => <div>{text}</div>} />
        <Table.Column<List>
          title="Description"
          dataIndex={nameof<List>("description")}
          render={(text: string) => <div>{text}</div>} />
        <Table.Column<List> title="Subscribe"
          dataIndex={nameof<List>("viewUrl")}
          width={123}
          fixed={this.state.isNarrowWindow ? undefined : "right"}
          render={(text: string, record: List, index: number) =>
            <SubscribeButton key={index} viewUrl={text} viewUrlMirrors={record.viewUrlMirrors} name={record.name} />}
        />
      </Table>
    );
  }
}