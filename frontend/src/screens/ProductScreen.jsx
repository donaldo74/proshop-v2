import {useState} from 'react'
import { useParams, useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
import { Form, Row, Col, Image, ListGroup, Card, Button, ListGroupItem} from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import Rating from "../components/Rating"
import Loader from "../components/Loader"
import Message from "../components/Message"
import { useGetProductDetailsQuery, useCreateReviewMutation } from "../slices/productsApiSlice"
import {addToCart} from '../slices/cartSlice'

const ProductScreen = () => {
  const {id:productId} = useParams()

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [qty, setQty] = useState(1)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')

  const {data: product, isLoading, refetch, error, } = useGetProductDetailsQuery(productId)

  const [createReview, {isLoading: loadingProductReview}] = useCreateReviewMutation()

  const { userInfo} = useSelector((state) => state.auth)

  const addToCartHandler = () => {
    dispatch(addToCart({...product, qty}))
    navigate('/cart')
  }

  return (
    <>
      <Link className="btn btn-light my-3" to="/">Go Back</Link>

      { isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error?.data?.message || error.error }</Message>
      ) : (
        <>
        <Row>
        <Col md={5}>
          <Image src={product.image} alt={product.name} fluid />
        </Col>
        <Col md={4}>
          <ListGroup variant='flush'>
            <ListGroupItem>
              <h3>{product.name}</h3>
            </ListGroupItem>
            <ListGroupItem>
              <Rating value={product.rating} text={`${product.numReviews} reviews`}></Rating>
            </ListGroupItem>
            <ListGroupItem>Price: ${product.price}</ListGroupItem>
            <ListGroupItem>Description: {product.description}</ListGroupItem>
          </ListGroup>
        </Col>
        <Col md={3}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroupItem>
                <Row>
                  <Col>Price:</Col>
                  <Col>
                    <strong>${product.price}</strong>
                  </Col>
                </Row>
              </ListGroupItem>
              <ListGroupItem>
                <Row>
                  <Col>Status:</Col>
                  <Col>
                    <strong>{product.countInStock > 0 ? 'In Stock':'Out of Stock'}</strong>
                  </Col>
                </Row>
              </ListGroupItem>

              {product.countInStock > 0 && (
                <ListGroup.Item>
                  <Row>
                    <Col>Qty</Col>
                    <Col>
                      <Form.Control
                        as='select'
                        value={qty}
                        onChange={(e) => setQty(Number(e.target.value))}>
                          {[...Array(product.countInStock).keys()].map((x) => (
                            <option key={ x + 1} value={x + 1}>
                              {x + 1}
                            </option>
                          ))}
                      </Form.Control>
                    </Col>
                  </Row>
                </ListGroup.Item>
              )}

              <ListGroupItem>
                <Button
                  className="btn-block"
                  type="button"
                  disabled={product.countInStock === 0}
                  onClick={addToCartHandler}
                >
                  Add To Cart
                </Button>
              </ListGroupItem>
            </ListGroup>
          </Card>
        </Col>
      </Row>
      <Row className='review'>
        <Col md={6}>
          <h2>Reviews</h2>
          {product.reviews.length === 0 && <Message>No Reviews</Message>}
          <ListGroup variant='flush'>
            { product.reviews.map(review => (
              <ListGroup.Item key={review._id}>
                <strong>{review.name}</strong>
                <Rating  value={review.rating} />
                <p>{review.createdAt.substring(0, 10)}</p>
                <p>{review.comment}</p>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
      </Row>
      </>
      )}
      
    </>
  )  
}

export default ProductScreen