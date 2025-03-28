require "test_helper"

class FacultiesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @faculty = faculties(:one)
  end

  test "should get index" do
    get faculties_url, as: :json
    assert_response :success
  end

  test "should create faculty" do
    assert_difference("Faculty.count") do
      post faculties_url, params: { faculty: { committees: @faculty.committees, department: @faculty.department, name: @faculty.name } }, as: :json
    end

    assert_response :created
  end

  test "should show faculty" do
    get faculty_url(@faculty), as: :json
    assert_response :success
  end

  test "should update faculty" do
    patch faculty_url(@faculty), params: { faculty: { committees: @faculty.committees, department: @faculty.department, name: @faculty.name } }, as: :json
    assert_response :success
  end

  test "should destroy faculty" do
    assert_difference("Faculty.count", -1) do
      delete faculty_url(@faculty), as: :json
    end

    assert_response :no_content
  end
end
