import React from 'react';
import { Tag } from 'antd';
import { useTranslation } from 'react-i18next';

export default function FilterPreview(props) {
  const { t } = useTranslation();
  const { values, renders, onClick, onRemove } = props;

  const newArray = (array) => {
    if(array[0] === 'Amazon') {
      let data = array.map((value) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, "").replaceAll(' ', ''))
      return data
    } else {
      return array
    }
  }

  const itemsNotEmpty = Object.keys(values || {})
    .map((key) => {
      if (!renders[key]) {
        return {
          value: null,
        };
      }
      return {
        key: key,
        label: renders[key].label,
        value: renders[key].render(newArray(values[key])),
      };
    })
    .filter(
      (item) =>
        item.value ||
        item.value === 0 ||
        item.value === false,
    );

  return (
    <div onClick={onClick} className="filter-preview">
      {!itemsNotEmpty.length || props.expanded ? (
        t('common.filters')
      ) : (
        <>
          {t('common.filters')}:
          <span className="filter-preview-values">
            {itemsNotEmpty.map((item, index) => (
              <Tag
                key={item.label}
                closable={Boolean(onRemove)}
                onClose={
                  onRemove
                    ? () => onRemove(item.key)
                    : undefined
                }
              >{props.allFilter === 1 &&  index === 0 ? 'All' : `${item.label}: ${item.value}`}</Tag>
            ))}
          </span>
        </>
      )}
    </div>
  );
}
