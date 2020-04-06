import styled from 'styled-components';
import { darken } from 'polished';

export const Wrapper = styled.div`
  height: 100%;
  background: #7159c1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Content = styled.div`
  background: #fff;
  width: 100%;
  max-width: 315px;
  text-align: center;
  align-items: center;
  padding-top: 30px;

  form {
    display: flex;
    flex-direction: column;
    margin-top: 30px;
    margin: 0 15px 15px 0;

    label {
      text-align: left;
      font-size: 12px;
      font-weight: bold;
      color: #333;
      padding: 0 15px;
      margin-top: 10px;
    }

    input {
      border: 1px solid #dcdcdc;
      border-radius: 4px;
      height: 44px;
      padding: 0 15px;
      color: #7159c1;
      margin: 0 10px 10px;
    }

    span {
      color: #f64c75;
      margin: 0 0 10px;
    }

    button {
      margin: 5px 0 0;
      height: 44px;
      background: #7159c1;
      font-weight: bold;
      color: #fff;
      border: 0;
      border-radius: 4px;
      font-size: 16px;
      margin: 0 10px 10px;
      margin-bottom: 30px;

      &:hover {
        background: ${darken(0.3, '#7159c1')};
      }
    }
  }
`;
