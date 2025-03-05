import React, { useState } from 'react';
import { Breadcrumb, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Else, If, Then } from 'react-if';
import Select from 'react-select';
import { REFERENCE_GENOME } from 'app/config/constants';
import { COLOR_BLUE } from 'app/config/theme';
import { Option } from 'app/shared/select/FormSelectWithLabelField';
import classnames from 'classnames';
import styles from './AnnotationBreadcrumbs.module.scss';

export type BreadcrumbType = 'text' | 'link' | 'input' | 'dropdown';

export interface IBasicBreadcrumb {
  type: BreadcrumbType;
  active?: boolean;
  // key: string;
  text: string;
  className?: string;
}

export interface ITextBreadcrumb extends IBasicBreadcrumb {
  type: 'text';
}

export interface ILinkBreadcrumb extends IBasicBreadcrumb {
  type: 'link';
  to: string;
}

export interface IInputBreadcrumb extends IBasicBreadcrumb {
  type: 'input';
  onChange: (newVal: string) => void;
}

export interface IDropdownBreadcrumb extends IBasicBreadcrumb {
  type: 'dropdown';
  onChange: (selectedOption: Option) => void;
  options: string[];
}

const Icon: React.FunctionComponent<{
  iconClassName: string;
  onClick: () => void;
  colorClassName?: string;
}> = props => {
  return (
    <i
      className={`fa fa-${props.iconClassName} ${props.colorClassName}`}
      style={{ cursor: 'pointer', width: 13 }}
      onClick={props.onClick}
    ></i>
  );
};
const TextBreadcrumb: React.FunctionComponent<IBasicBreadcrumb> = props => {
  return (
    <Breadcrumb.Item active={props.active} className={props.className}>
      {props.text}
    </Breadcrumb.Item>
  );
};

const LinkBreadcrumb: React.FunctionComponent<ILinkBreadcrumb> = props => {
  return (
    <Breadcrumb.Item
      linkAs={Link}
      linkProps={{ to: props.to }}
      active={props.active}
      className={props.className}
    >
      {props.text}
    </Breadcrumb.Item>
  );
};

const InputBreadcrumb: React.FunctionComponent<IInputBreadcrumb> = props => {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(props.text);
  const editableContentFontSize = '13px';
  return (
    <Breadcrumb.Item
      active
      style={{ color: COLOR_BLUE }}
      className={props.className}
    >
      <If condition={editing}>
        <Then>
          <span style={{ fontSize: editableContentFontSize }}>
            <input
              type={'text'}
              value={text}
              style={{
                border: '1px solid lightgrey',
                borderRadius: 4,
                minWidth: 180,
              }}
              onChange={e => setText(e.target.value)}
            />
            <Button
              size={'sm'}
              variant={'success'}
              style={{ padding: '0 0.25rem' }}
              className={'ml-1'}
            >
              <Icon
                colorClassName="text-white"
                iconClassName="check"
                onClick={() => {
                  props.onChange(text);
                  setEditing(false);
                }}
              />
            </Button>
            <Button
              size={'sm'}
              variant={'danger'}
              style={{ padding: '0 0.25rem' }}
              className={'ml-1'}
            >
              <Icon
                colorClassName="text-white"
                iconClassName="times"
                onClick={() => {
                  setText(props.text);
                  setEditing(false);
                }}
              />
            </Button>
          </span>
        </Then>
        <Else>
          {props.text}
          <Icon
            iconClassName="pencil-square-o ml-1"
            onClick={() => setEditing(true)}
          />
        </Else>
      </If>
    </Breadcrumb.Item>
  );
};

const DropdownBreadcrumb: React.FunctionComponent<IDropdownBreadcrumb> = props => {
  const [editing, setEditing] = useState(false);
  return (
    <Breadcrumb.Item
      active
      style={{ color: COLOR_BLUE }}
      className={props.className}
    >
      <If condition={editing}>
        <Then>
          <Select
            menuIsOpen
            theme={theme => ({
              ...theme,
              colors: {
                ...theme.colors,
                primary: COLOR_BLUE,
              },
            })}
            styles={{
              control: baseStyles => ({
                ...baseStyles,
                fontSize: 12,
                width: 110,
                minHeight: 10,
              }),
              option: baseStyles => ({
                ...baseStyles,
                fontSize: 12,
                paddingTop: 5,
                paddingBottom: 5,
              }),
              indicatorSeparator: baseStyles => ({
                ...baseStyles,
                marginTop: 5,
                marginBottom: 5,
              }),
              dropdownIndicator: baseStyles => ({
                ...baseStyles,
                width: 30,
                paddingTop: 0,
                paddingBottom: 0,
              }),
              input: baseStyles => ({
                ...baseStyles,
                margin: 0,
                padding: 0,
              }),
            }}
            options={props.options.map(option => {
              return { label: option, value: option };
            })}
            onChange={(selectedOption: Option) => {
              props.onChange(selectedOption);
              setEditing(false);
            }}
            defaultValue={{
              label: props.text,
              value: props.text,
            }}
          />
        </Then>
        <Else>
          {props.text}
          <Icon
            iconClassName="pencil-square-o ml-1"
            onClick={() => setEditing(true)}
          />
        </Else>
      </If>
    </Breadcrumb.Item>
  );
};

export const AnnotationBreadcrumbs: React.FunctionComponent<{
  breadcrumbs: (
    | ITextBreadcrumb
    | ILinkBreadcrumb
    | IInputBreadcrumb
    | IDropdownBreadcrumb
  )[];
}> = props => {
  return (
    <Breadcrumb>
      {props.breadcrumbs.map((breadcrumb, index) => {
        const commonProps: IBasicBreadcrumb & { key: number } = {
          type: 'text',
          key: index,
          text: breadcrumb.text,
          active: index === props.breadcrumbs.length - 1,
          className: classnames(styles.breadcrumb),
        };
        switch (breadcrumb.type) {
          case 'text':
            return <TextBreadcrumb {...commonProps} />;
          case 'link':
            return (
              <LinkBreadcrumb
                {...commonProps}
                type={'link'}
                to={breadcrumb.to}
              />
            );
          case 'dropdown':
            return (
              <DropdownBreadcrumb
                {...commonProps}
                type={'dropdown'}
                options={[REFERENCE_GENOME.GRCh37, REFERENCE_GENOME.GRCh38]}
                onChange={breadcrumb.onChange}
              />
            );
          case 'input':
            return (
              <InputBreadcrumb
                {...commonProps}
                type={'input'}
                onChange={breadcrumb.onChange}
              />
            );
          default:
            return <TextBreadcrumb {...commonProps} type={'text'} />;
        }
      })}
    </Breadcrumb>
  );
};
