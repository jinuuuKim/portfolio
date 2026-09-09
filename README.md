# portfolio

김진우(Cloud Engineer) 포트폴리오 사이트 소스. GitHub Pages로 배포된다.

### ▶ https://jinuuukim.github.io/portfolio/

빌드 도구·프레임워크 없이 HTML·CSS·JS만 쓴다. `main`에 푸시하면 Actions가 그대로 올린다.

## 구성

| 경로 | 내용 |
| --- | --- |
| `website/` | 사이트 본체 — 홈 + 프로젝트 상세 페이지 2개 |
| `pdf/` | 사이트에서 내려받는 프로젝트 원본 PDF 2종 |
| `img-originals/` | 사이트 이미지의 변환 전 원본 (WebP로 굽기 전 백업, 52장) |
| `.github/workflows/pages.yml` | `website/*` + `pdf/`를 `_site`로 묶어 Pages 배포 |

`pdf/` 경로는 이미 제출한 PDF 안에 링크가 박혀 있어 바꾸지 않는다.

## 다루는 프로젝트

| 프로젝트 | 내용 | 코드 |
| --- | --- | --- |
| **CNAPP-Agentic** | 멀티클라우드 보안 신호를 OCSF로 통합하고 AI가 스스로 증거를 수집해 판정 | [jun0601/cnapp-agentic](https://github.com/jun0601/cnapp-agentic) |
| **StockOps** | 서울·오하이오 두 리전 EKS를 Terraform으로 세운 ERP/WMS 인프라 | [jinuuuKim/Stockops-Infra](https://github.com/jinuuuKim/Stockops-Infra) |

설계 판단과 트러블슈팅은 사이트에 있다. 이 README는 레포 안내만 한다.
