import 'dotenv/config'

const CONFIG = {
  db: process.env.DB,
  jwt_private: `${process.env.JWT_PRIVATE}`,
  jwt_public: `${process.env.JWT_PUBLIC}`,
  port: parseInt(process.env.PORT ?? '4000')
}

export default CONFIG
