class Faculty < ApplicationRecord
  validates :name, :department, presence: true
end
