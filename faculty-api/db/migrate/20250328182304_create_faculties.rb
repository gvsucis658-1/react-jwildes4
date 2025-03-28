class CreateFaculties < ActiveRecord::Migration[8.0]
  def change
    create_table :faculties do |t|
      t.string :name
      t.string :department
      t.text :committees

      t.timestamps
    end
  end
end
