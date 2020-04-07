import styled from 'styled-components';
// import { colors } from '~/styles/colors';

export const Container = styled.div`
  background: #fff;
  padding: 0 30px;
`;

export const Content = styled.div`
  height: 64px;
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;

  nav {
    display: flex;
    align-items: center;

    img {
      margin-top: 20px;
      margin-right: 20px;
      padding-right: 20px;
      border-right: 1px solid #333;
    }

    aside {
      display: flex;
      align-items: center;
    }
  }
`;

export const Navigation = styled.div`
  padding-left: 30px;
  height: 32px;
  border-left: 1px solid #ddd;

  display: flex;
  align-items: center;

  a {
    margin-right: 20px;
    font-size: 15px;
    font-weight: bold;
    color: #999;
    transition: color 0.2s;

    &:hover {
      color: #834323;
    }

    &.active {
      color: #444;
    }
  }
`;

export const Profile = styled.div`
  display: flex;
  margin-left: 20px;
  padding-left: 20px;
  border-left: 1px solid #eee;

  div {
    text-align: right;
    margin-right: 10px;

    strong {
      display: block;
      color: #333;
    }

    button {
      display: block;
      margin-top: 2px;
      font-size: 12px;
      color: red;
      background: transparent;
      border: 0;
    }
  }

  img {
    height: 40px;
    width: 40px;
    border-radius: 50%;
  }
`;
