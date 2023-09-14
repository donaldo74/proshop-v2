import { Helmet } from 'react-helmet-async'

const Meta = ({ title, description, keywords }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name='desription' content={description} />
      <meta name='keywords' content={keywords} />
    </Helmet>
  )
}

Meta.defaultProps = {
  title: 'Welcome to Proshop',
  description: 'We sell the best products at great rates',
  keywords: 'electronics, buy electronics, cheap electronics',
}
export default Meta