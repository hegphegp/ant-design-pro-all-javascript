import React, { useState } from 'react';
import { Modal } from 'antd';

import FormRender from 'form-render/lib/antd';
import SCHEMA from './schema.json';

const OperationModal = props => {
  const [formData, setData] = useState({});
  const [valid, setValid] = useState([]);

  const onSubmit = () => {
    if (valid.length > 0) {
      alert(`校验未通过字段：${valid.toString()}`);
    } else {
      alert(JSON.stringify(formData, null, 2));
    }
  };

  const { done, visible, current, onCancel, onDone } = props;

  const modalFooter = done
    ? { footer: null, onCancel: onDone }
    : { okText: '保存', onOk: onSubmit, onCancel };

  return (
    <Modal
      // getContainer={false}
      title={done ? null : `任务${current ? '编辑' : '添加'}`}
      width={1200}
      destroyOnClose
      visible={visible}
      {...modalFooter}
    >
      <FormRender {...SCHEMA} formData={formData} onChange={setData} onValidate={setValid} />
    </Modal>
  );
};

export default OperationModal;
