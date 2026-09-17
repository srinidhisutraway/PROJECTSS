public class Selectionsort {
    public static void main(String[] args) {
        int[] arr1={5,4,6,2,8,1};
        int temp;
        for(int i=0;i<arr1.length;i++){//if want can also create min=i
            for(int j=i+1;j<arr1.length;j++){
                if(arr1[i]>arr1[j]){
                temp=arr1[i];
                arr1[i]=arr1[j];
                arr1[j]=temp; 
            } 
             
            }System.out.print(arr1[i]+" ");
        }
         
        

    }
    
}
