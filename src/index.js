import React from "react";
import ReactDOM from "react-dom";

import {
  ReactiveBase,
  DataSearch,
  MultiList,
  SelectedFilters,
  ReactiveList
} from "@appbaseio/reactivesearch";
import { Row, Button, Col, Card, Switch, Tree, Popover, Affix } from "antd";
import "antd/dist/antd.css";

function getNestedValue(obj, path) {
  const keys = path.split(".");
  const currentObject = obj;
  const nestedValue = keys.reduce((value, key) => {
    if (value) {
      return value[key];
    }
    return "";
  }, currentObject);
  if (typeof nestedValue === "object") {
    return JSON.stringify(nestedValue);
  }
  return nestedValue;
}

function renderItem(res, triggerClickAnalytics) {
  let { image, url, description, title } = {
    title: "evenlibelleemploi",
    description: "evenlibellesociete",
    image: "",
    url: ""
  };
  image = getNestedValue(res, image);
  title = getNestedValue(res, title);
  url = getNestedValue(res, url);
  description = getNestedValue(res, description);
  return (
    <Row
      onClick={triggerClickAnalytics}
      type="flex"
      gutter={16}
      key={res._id}
      style={{ margin: "20px auto", borderBottom: "1px solid #ededed" }}
    >
      <Col span={image ? 6 : 0}>{image && <img src={image} alt={title} />}</Col>
      <Col span={image ? 18 : 24}>
        <h3
          style={{ fontWeight: "600" }}
          dangerouslySetInnerHTML={{
            __html: title || "Choose a valid Title Field"
          }}
        />
        <p
          style={{ fontSize: "1em" }}
          dangerouslySetInnerHTML={{
            __html: description || "Choose a valid Description Field"
          }}
        />
      </Col>
      <div style={{ padding: "20px" }}>
        {url ? (
          <Button
            shape="circle"
            icon="link"
            style={{ marginRight: "5px" }}
            onClick={() => window.open(url, "_blank")}
          />
        ) : null}
      </div>
    </Row>
  );
}

const App = () => (
  <ReactiveBase
    app="directory"
    credentials="null"
    url="http://172.16.208.55:32332"
    analytics
  >
    <Row gutter={16} style={{ padding: 20 }}>
      <Col span={12}>
        <Card>
          <MultiList
            componentId="list-2"
            dataField="evenlibellesociete.keyword"
            size={100}
            style={{
              marginBottom: 20
            }}
            title="Société"
          />
          <MultiList
            componentId="list-3"
            dataField="evenlibellestructure.keyword"
            size={100}
            style={{
              marginBottom: 20
            }}
            title="Services"
          />
          <MultiList
            componentId="list-4"
            dataField="evenlibelleinsee.keyword"
            size={100}
            style={{
              marginBottom: 20
            }}
            title="Ville"
          />
        </Card>
      </Col>
      <Col span={12}>
        <DataSearch
          componentId="search"
          dataField={["sn", "sn.keyword", "givenName", "givenName.keyword"]}
          fieldWeights={[5, 1, 1, 1]}
          fuzziness={0}
          highlight={true}
          highlightField={["sn", "givenName"]}
          placeholder="Hey"
          style={{
            marginBottom: 20
          }}
          title="Recherche ..."
        />

        <SelectedFilters />

        <ReactiveList
          componentId="result"
          dataField="_score"
          pagination={true}
          react={{
            and: ["search", "list-2", "list-3", "list-4"]
          }}
          renderItem={renderItem}
          size={10}
          stream={true}
          style={{
            marginTop: 20
          }}
        />
      </Col>
    </Row>
  </ReactiveBase>
);

ReactDOM.render(<App />, document.getElementById("root"));
