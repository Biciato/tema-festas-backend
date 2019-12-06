import React from "react";
import Select from "react-select";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export default function TypeSelect(props) {
    const handleTypeChange = type => props.onTypeChange(type.value);
    if (props.show) {
        return (
            <Row bsPrefix="row mt-3">
                <Col>
                    <Select
                        defaultValue={{ value: "Subtipo", label: "Subtipo" }}
                        options={["poa", "liso", "temas"].map(item => ({
                            value: item,
                            label: item
                        }))}
                        onChange={handleTypeChange}
                        styles={{
                            control: styles => ({
                                ...styles,
                                fontSize: "14px",
                                fontWeight: "600"
                            })
                        }}
                    />
                </Col>
            </Row>
        );
    } else {
        return null;
    }
}
