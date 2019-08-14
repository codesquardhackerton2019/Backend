import chai from 'chai';
import request from 'supertest';
import app from '../src/app';

const expect = chai.expect;

const agent = request.agent(app);

describe('GET /auth/signup', () => {
  it('200 OK 이어야 함', () => {
    return agent.get('/auth/signup')
      .expect(200);
  });
});

describe('POST /auth/signin', () => {
  it('존재하지 않는 계정으로 로그인 시도', (done) => {
    return agent.post('/auth/signin')
      .field('email', 'anonymous@test.io')
      .field('password', 'notexist')
      .expect(500)
      .end((err, res) => {
        expect(res.error).not.to.be.undefined;
        done();
      });
  });

  it('비밀번호 불일치', (done) => {
    return agent.post('/auth/signin')
      .field('email', 'test1@codesquad.io')
      .field('password', '123123123')
      .expect(500)
      .end((err, res) => {
        expect(res.error).not.to.be.undefined;
        done();
      });
  });

  it('유효한 계정 정보일 때 에러 없이 리다이렉트되어야 함', (done) => {
    return agent.post('/auth/signin')
      .field('email', 'test1@codesquad.io')
      .field('password', 'codesquad001')
      .expect(302)
      .end((err, res) => {
        expect(res.error).not.to.be.undefined;
        done();
      });
  });

  it('로그인 된 상태에서 signup 페이지로 이동할 경우 리다이렉트', (done) => {
    return agent.get('/auth/signup')
      .expect(302)
      .end((err, res) => {
        expect(res.error).not.to.be.undefined;
        done();
      });
  });

  it('로그아웃 테스트', (done) => {
    return agent.post('/auth/signout')
      .expect(302)
      .end((err, res) => {
        expect(res.error).not.to.be.undefined;
        done();
      });
  });
});
