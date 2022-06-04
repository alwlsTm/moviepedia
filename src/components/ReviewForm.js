import { useState } from "react";
import useAsync from "../hooks/useAsync";
import FileInput from "./FileInput";
import RatingInput from "./RatingInput";
import './ReviewForm.css';

const INITIAL_VALUES = {  //하나의 state로 관리
  //각 input의 필드 값
  title: '',
  rating: 0,
  content: '',
  imgFile: null,
}

function ReviewForm({
  initialValues = INITIAL_VALUES, //각 input 초기값
  initialPreview,   //이미지 미리보기 초기값
  onSubmit,  //글 작성 & 수정
  onSubmitSuccess,  //submit 성공 & 글 수정 성공
  onCancel,  //수정중인 글 취소
}) {
  const [values, setValues] = useState(initialValues);  //values state(하나의 state로 관리)
  const [isSubmitting, submittingError, onSubmitAsync] = useAsync(onSubmit);

  const handleChange = (name, value) => {
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,  //name으로 프로퍼티 명을 지정, value로 해당하는 값을 지정
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    handleChange(name, value);
  };

  const handleSubmit = async (e) => { //onSubmit
    e.preventDefault(); //HTML 폼의 기본 동작을 막음
    const formData = new FormData();  //새 formData 인스턴스 생성
    //각 필드 값 지정
    formData.append('title', values.title);
    formData.append('rating', values.rating);
    formData.append('content', values.content);
    formData.append('imgFile', values.imgFile);

    const result = await onSubmitAsync(formData);
    if (!result) return;

    const { review } = result;  //리스폰스 된 아이템
    onSubmitSuccess(review);
    setValues(INITIAL_VALUES);  //리퀘스트가 끝나면 폼 초기화
  }

  return (
    <form className="ReviewForm" onSubmit={handleSubmit}>
      <FileInput
        name="imgFile"
        value={values.imgFile}
        initialPreview={initialPreview}
        onChange={handleChange}
      />
      <input name="title" value={values.title} onChange={handleInputChange}></input>
      <RatingInput
        name="rating"
        value={values.rating}
        onChange={handleChange}
      />
      <textarea name="content" value={values.content} onChange={handleInputChange}></textarea>
      {onCancel && <button onClick={onCancel}>취소</button>}
      <button type="submit" disabled={isSubmitting}>확인</button>
      {submittingError?.message && <div>{submittingError.message}</div>}
    </form>
  );
}

export default ReviewForm;